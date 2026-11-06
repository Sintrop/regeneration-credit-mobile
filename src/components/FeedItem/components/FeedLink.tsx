import { TouchableOpacity } from "react-native";

import { Text } from "@components";

export function FeedLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} className="self-start">
      <Text className="text-green-primary font-semibold">{label} ›</Text>
    </TouchableOpacity>
  );
}
