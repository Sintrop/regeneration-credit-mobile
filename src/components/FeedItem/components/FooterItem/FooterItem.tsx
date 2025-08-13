import { TouchableOpacity, View } from "react-native";
import { Text } from "@components";

interface Props {

}
export function FooterItem({}: Props) {
  return (
    <View className="w-full border-t border-card-secondary pt-3 items-start">
      <Button />
    </View>
  )
}

function Button() {
  return (
    <TouchableOpacity
      className="w-28 items-center gap-1"
    >
      <View className="w-5 h-5 bg-white"/>
      <Text className="font-bold text-white text-center">See</Text>
    </TouchableOpacity>
  )
}