import { Text, TextProps } from "@components";
import { useTranslation } from "react-i18next";

interface Props extends TextProps {
  userType: UserTypeTextType
}
export function UserTypeText({ userType, ...textProps}: Props) {
  const { t } = useTranslation();
  const text = userTypeToText[userType];

  return (
    <Text {...textProps}>
      {t(`common.${text}`)}
    </Text>
  )
}

const userTypeToText = {
  1: "regenerator",
  2: "inspector"
}
export type UserTypeTextType = keyof typeof userTypeToText