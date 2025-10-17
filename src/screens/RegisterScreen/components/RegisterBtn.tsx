import { ActivityIndicator, TouchableOpacity } from "react-native";

import { Text } from "@components";

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}
export function RegisterBtn({ label, onPress, disabled, isLoading}: Props) {
  return (
    <TouchableOpacity
        className="w-full h-12 rounded-2xl items-center justify-center bg-green-primary mb-10 disabled:opacity-50"
        onPress={onPress}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size={30} color="white" />
        ) : (
          <Text className="text-white font-semibold">{label}</Text>
        )}
      </TouchableOpacity>
  )
}