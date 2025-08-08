import { ComponentProps } from "react";
import { Text as RNText, TextStyle } from "react-native";

type TextVariants = "regular" | "bold" | "semibold"
type RNTextProps = ComponentProps<typeof RNText>;
interface Props extends RNTextProps {
  preset?: TextVariants
  style?: TextStyle
}

export function Text({ children, style, ...restProps }: Props) {
  return (
    <RNText style={[style]} {...restProps}>
      {children}
    </RNText>
  )
}
