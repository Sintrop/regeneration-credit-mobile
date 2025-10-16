import { useContext } from "react";
import { TxContext, TxContextProps } from "@contexts";

export function useTxContext(): TxContextProps {
  return useContext(TxContext);
}
