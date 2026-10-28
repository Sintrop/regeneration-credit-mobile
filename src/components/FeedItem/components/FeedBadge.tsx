import { View } from "react-native";

import { Text } from "@components";

const TONES = {
  green: { dot: "bg-green-primary", text: "text-green-primary", bg: "bg-green-primary/10" },
  blue: { dot: "bg-blue-primary", text: "text-blue-primary", bg: "bg-blue-primary/10" },
  amber: { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-400/10" },
  teal: { dot: "bg-teal-300", text: "text-teal-200", bg: "bg-teal-300/10" },
};

export type FeedTone = keyof typeof TONES;

/** Small label at the top of a feed item telling what kind of news it is. */
export function FeedBadge({ label, tone }: { label: string; tone: FeedTone }) {
  const style = TONES[tone];
  return (
    <View className={`self-start flex-row items-center gap-2 px-3 py-1 rounded-full ${style.bg}`}>
      <View className={`w-2 h-2 rounded-full ${style.dot}`} />
      <Text className={`text-xs font-semibold ${style.text}`}>{label}</Text>
    </View>
  );
}
