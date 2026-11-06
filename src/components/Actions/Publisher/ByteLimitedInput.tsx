import { View } from "react-native";

import { Text, TextInput } from "@components";
import { utf8ByteLength } from "@utils";

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  maxBytes: number;
  multiline?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "url";
  autoCapitalize?: "none" | "sentences";
}

/** Text input with a byte counter, since the contracts limit bytes(text).length. */
export function ByteLimitedInput({ label, value, onChangeText, maxBytes, ...inputProps }: Props) {
  const used = utf8ByteLength(value);
  const over = used > maxBytes;

  return (
    <View className="gap-1">
      <TextInput label={label} value={value} onChangeText={onChangeText} {...inputProps} />
      <Text className={`text-xs text-right ${over ? "text-red-400" : "text-gray-400"}`}>
        {used}/{maxBytes}
      </Text>
    </View>
  );
}
