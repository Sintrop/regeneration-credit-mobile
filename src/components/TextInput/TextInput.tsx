import { View, TextInput as RNTextInput, TextInputProps } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";

interface Props extends TextInputProps {
  label?: string;
  disabled?: boolean;
}
export function TextInput({ label, disabled, ...restProps }: Props) {
  const { t } = useTranslation();
  return (
    <View>
      {label && (
        <Text className="text-gray-300 mb-2">{label}</Text>
      )}
      <RNTextInput
        className={`w-full h-12 rounded-2xl bg-card-secondary text-white px-3 ${disabled && 'opacity-80'}`}
        placeholderTextColor="#aaa"
        placeholder={t('common.typeHere')}
        {...restProps}
      />
    </View>
  )
}
