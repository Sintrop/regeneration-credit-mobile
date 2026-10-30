import { View } from "react-native";

interface Props {
  /** 0 to 100 */
  value: number;
  color?: string;
}

export function ProgressBar({ value, color = "bg-green-primary" }: Props) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <View className="h-2 rounded-full bg-card-secondary overflow-hidden">
      <View className={`h-2 rounded-full ${color}`} style={{ width: `${width}%`, minWidth: width > 0 ? 4 : 0 }} />
    </View>
  );
}
