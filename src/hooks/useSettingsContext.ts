import { useContext } from "react";
import { SettingsContext, SettingsContextProps } from "@contexts";

export function useSettingsContext(): SettingsContextProps {
  return useContext(SettingsContext);
}
