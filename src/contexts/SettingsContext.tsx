import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { checkRpc, DEFAULT_RPC, RpcCheckResult } from "../services/rpcHealth";

const RPC_STORAGE_KEY = "@regenerationcredit/rpc";
const HEALTH_INTERVAL_MS = 30000;

interface SettingsProviderProps {
  children: ReactNode;
}

export interface SettingsContextProps {
  rpc: string;
  ipfsGateway: string;
  ipfsApi: string;
  explorerUrl: string;
  isDefaultRpc: boolean;
  /** Validates the RPC (Sintrop chain id) and switches to it; resolves with the check result. */
  changeRpc: (url: string) => Promise<RpcCheckResult>;
  resetRpc: () => Promise<void>;
  rpcHealth?: RpcCheckResult;
  /** The current RPC failed its last health check. */
  rpcUnstable: boolean;
  recheckRpc: () => void;
}

export const SettingsContext = createContext({} as SettingsContextProps);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const queryClient = useQueryClient();
  const [rpc, setRpc] = useState(DEFAULT_RPC);
  const [ipfsGateway] = useState("https://ipfs.sintrop.com");
  const [ipfsApi] = useState("https://apiipfs.sintrop.com");
  const [explorerUrl] = useState("https://explorer.sintrop.com");

  useEffect(() => {
    AsyncStorage.getItem(RPC_STORAGE_KEY)
      .then(stored => { if (stored) setRpc(stored); })
      .catch(() => {});
  }, []);

  const { data: rpcHealth, refetch } = useQuery({
    queryKey: ["RpcHealth", rpc],
    queryFn: () => checkRpc(rpc),
    refetchInterval: HEALTH_INTERVAL_MS,
    retry: false,
  });

  const applyRpc = useCallback(async (url: string) => {
    setRpc(url);
    // Every query reads from the RPC: drop cached data so screens reload from the new one.
    await queryClient.resetQueries();
  }, [queryClient]);

  async function changeRpc(url: string): Promise<RpcCheckResult> {
    const trimmed = url.trim().replace(/\/+$/, "");
    const result = await checkRpc(trimmed);
    if (!result.ok) return result;
    try {
      await AsyncStorage.setItem(RPC_STORAGE_KEY, trimmed);
    } catch {
      // Still applied for this session.
    }
    await applyRpc(trimmed);
    return result;
  }

  async function resetRpc() {
    try {
      await AsyncStorage.removeItem(RPC_STORAGE_KEY);
    } catch {
      // Nothing stored.
    }
    await applyRpc(DEFAULT_RPC);
  }

  function recheckRpc() {
    refetch();
    queryClient.invalidateQueries();
  }

  return (
    <SettingsContext.Provider
      value={{
        rpc,
        ipfsGateway,
        ipfsApi,
        explorerUrl,
        isDefaultRpc: rpc === DEFAULT_RPC,
        changeRpc,
        resetRpc,
        rpcHealth,
        rpcUnstable: !!rpcHealth && !rpcHealth.ok,
        recheckRpc,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
