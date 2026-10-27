import { ActivityIndicator, TouchableOpacity } from "react-native";

import { Text } from "@components";

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SubmitButton({ label, onPress, disabled, isLoading }: Props) {
  return (
    <TouchableOpacity
      className="w-full h-12 mt-2 rounded-2xl items-center justify-center bg-green-primary disabled:opacity-50"
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-green-secondary font-bold">{label}</Text>}
    </TouchableOpacity>
  );
}
