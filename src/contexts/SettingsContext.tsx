import { createContext, ReactNode, useState } from "react";

interface SettingsProviderProps {
  children: ReactNode;
}

export interface SettingsContextProps {
  rpc: string;
}

export const SettingsContext = createContext({} as SettingsContextProps);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [rpc, setRpc] = useState("https://sequoiarpc.sintrop.com");

  return (
    <SettingsContext.Provider
      value={{ rpc }}
    >
      {children}
    </SettingsContext.Provider>
  )
}