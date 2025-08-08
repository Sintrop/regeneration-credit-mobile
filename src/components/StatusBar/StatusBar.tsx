import { View, StatusBar as RNStatusBar } from "react-native";
import { useAppSafeArea } from "@hooks";

export function StatusBar() {
  const { top } = useAppSafeArea();

  return (
    <View className="w-full bg-green-header" style={{ height: top }}>
      <RNStatusBar barStyle="light-content" />
    </View>
  )
}