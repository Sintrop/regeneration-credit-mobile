import { View, TextInput as RNTextInput, TextInputProps } from "react-native";

import { Text } from "@components";

interface Props extends TextInputProps {
  label?: string;
}
export function TextInput({ label, ...restProps }: Props) {
  return (
    <View>
      {label && (
        <Text className="text-gray-300 mb-2">{label}</Text>
      )}
      <RNTextInput
        className="w-full h-12 rounded-2xl bg-card-secondary text-white px-3"
        placeholderTextColor="#aaa"
        {...restProps}
      />
    </View>
  )
}
