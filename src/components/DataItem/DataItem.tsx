import { View } from "react-native";
import { Text } from "@components";

interface Props {
  title: string;
  value?: string | number;
  suffix?: string;
}
export function DataItem({ title, value, suffix}: Props) {
  return (
    <View className="flex-row items-center gap-1 w-full overflow-hidden">
      <Text className="font-bold text-white">{title}: </Text>
      <Text 
        className="text-white text-ellipsis truncate max-w-[75%]"
        numberOfLines={1}
      >
        {value} {suffix && suffix}
      </Text>
    </View>
  )
}
