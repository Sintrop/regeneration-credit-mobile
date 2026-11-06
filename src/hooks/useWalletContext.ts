import { useContext } from "react";
import { WalletContext, WalletContextProps } from "@contexts";

export function useWalletContext(): WalletContextProps {
  return useContext(WalletContext);
}
