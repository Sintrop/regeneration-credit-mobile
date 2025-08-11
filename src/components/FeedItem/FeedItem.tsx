import { View } from "react-native";
import { FeedItemTypes } from "@domain";

interface Props {
  type: FeedItemTypes;
  id: number
}
export function FeedItem({ id, type }: Props) {
  return (
    <View className="w-full bg-card-primary p-5">

    </View>
  )
}
