import { createContext, ReactNode, useState } from "react";

interface SettingsProviderProps {
  children: ReactNode;
}

export interface SettingsContextProps {
  rpc: string;
  ipfsGateway: string;
}

export const SettingsContext = createContext({} as SettingsContextProps);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [rpc, setRpc] = useState("https://rpc.sintrop.com");
  const [ipfsGateway, setIpfsGateway] = useState("https://ipfs.sintrop.com");

  return (
    <SettingsContext.Provider
      value={{ rpc, ipfsGateway }}
    >
      {children}
    </SettingsContext.Provider>
  )
}