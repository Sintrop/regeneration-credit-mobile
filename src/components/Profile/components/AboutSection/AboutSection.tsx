import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@components";

interface Props {
  text?: string;
  isLoading?: boolean;
}
export function AboutSection({ text }: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-1 p-5 rounded-2xl bg-card-primary">
      <Text className="font-bold text-white text-xl">
        {t("profile.about")}
      </Text>
      <Text className="text-white">{text}</Text>
    </View>
  );
}
