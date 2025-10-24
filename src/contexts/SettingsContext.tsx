import { createContext, ReactNode, useState } from "react";

interface SettingsProviderProps {
  children: ReactNode;
}

export interface SettingsContextProps {
  rpc: string;
  ipfsGateway: string;
  ipfsApi: string;
  explorerUrl: string;
}

export const SettingsContext = createContext({} as SettingsContextProps);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [rpc, setRpc] = useState("https://rpc.sintrop.com");
  const [ipfsGateway, setIpfsGateway] = useState("https://ipfs.sintrop.com");
  const [ipfsApi, setIpfsApi] = useState("https://apiipfs.sintrop.com");
  const [explorerUrl, setExplorerUrl] = useState("https://explorer.sintrop.com");

  return (
    <SettingsContext.Provider
      value={{ rpc, ipfsGateway, ipfsApi, explorerUrl }}
    >
      {children}
    </SettingsContext.Provider>
  )
}