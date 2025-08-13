import { ComponentProps } from "react";
import { Text as RNText, TextStyle } from "react-native";

type TextVariants = "regular" | "bold" | "semibold"
type RNTextProps = ComponentProps<typeof RNText>;
export interface TextProps extends RNTextProps {
  preset?: TextVariants
  style?: TextStyle
}

export function Text({ children, style, ...restProps }: TextProps) {
  return (
    <RNText style={[style]} {...restProps}>
      {children}
    </RNText>
  )
}
