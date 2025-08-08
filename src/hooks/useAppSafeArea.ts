import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useAppSafeArea() {
  const { top, bottom } = useSafeAreaInsets();
  return { top, bottom }
}