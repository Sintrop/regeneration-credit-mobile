import { useQuery } from "@tanstack/react-query";
import Web3 from "web3";

import { useSettingsContext } from "@hooks";
import { QueryKeys } from "@types";

const WEI = 10 ** 18;

/** SIN balance read from the Sintrop RPC (the MetaMask SDK cached balance is often stale or 0). */
export function useNativeBalance(address?: string) {
  const { rpc } = useSettingsContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.NativeBalance, address],
    queryFn: async () => {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
      return Number(await web3.eth.getBalance(address as string)) / WEI;
    },
    enabled: !!address,
    refetchInterval: 30000,
  });
  return { balance: data ?? 0, isLoading: !!address && isLoading, refetch };
}
