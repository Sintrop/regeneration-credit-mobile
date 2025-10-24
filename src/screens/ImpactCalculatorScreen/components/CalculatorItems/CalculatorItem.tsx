import { TouchableOpacity, View } from "react-native";

import { Offset, Text } from "@components";
import { CalculatorItemProps } from "@domain";
import { useUserContext } from "@hooks";

interface Props {
  item: CalculatorItemProps;
}

export function CalculatorItem({ item }: Props) {
  const { userType } = useUserContext();

  return (
    <View className="flex-row items-center justify-between h-12 px-3 border-b border-card-secondary">
      <Text className="text-white">{item.item}</Text>

      {userType === 7 && (
        <Offset item={item}>
          <OffsetButton />
        </Offset>
      )}
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
