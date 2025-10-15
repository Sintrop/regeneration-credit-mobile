import { useContext } from "react";
import { UserContext, UserContextProps } from "@contexts";

export function useUserContext(): UserContextProps {
  return useContext(UserContext);
}
