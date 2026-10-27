import { View } from "react-native";

import { Text } from "@components";

interface Props {
  title: string;
  value?: string | number;
  size?: "regular" | "compact";
}

/** Bordered card with a big number and a one-line label that shrinks to fit. */
export function StatBox({ title, value, size = "regular" }: Props) {
  const compact = size === "compact";

  return (
    <View className={`${compact ? "w-20" : "w-28"} p-3 border-2 border-white rounded-2xl items-center`}>
      <Text className={`font-bold text-white ${compact ? "text-xl" : "text-3xl"}`}>{value}</Text>
      <Text
        className={`${compact ? "text-xs" : "text-sm"} text-white text-center`}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {title}
      </Text>
    </View>
  );
}
