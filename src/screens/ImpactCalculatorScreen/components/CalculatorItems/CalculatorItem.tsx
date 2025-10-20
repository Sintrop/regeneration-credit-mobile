import { TouchableOpacity, View } from "react-native";

import { Offset, Text } from "@components";
import { CalculatorItemProps } from "@domain";

interface Props {
  item: CalculatorItemProps;
}

export function CalculatorItem({ item }: Props) {
  return (
    <View className="flex-row items-center justify-between h-12 px-3 border-b border-card-secondary">
      <Text className="text-white">{item.item}</Text>

      <Offset item={item}>
        <OffsetButton />
      </Offset>
    </View>
  )
}

interface OffsetButtonProps {
  openModal?: () => void;
}
function OffsetButton({ openModal }: OffsetButtonProps) {
  return (
    <TouchableOpacity 
      onPress={openModal}
      className="px-5 h-8 rounded-2xl bg-green-primary items-center justify-center"
      hitSlop={5}
    >
      <Text className="text-white font-semibold">Offset</Text>
    </TouchableOpacity>
  )
}
