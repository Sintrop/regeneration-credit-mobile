import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";

export function RequestedInspection() {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between px-3 h-10 rounded-2xl bg-orange-400">
      <Text className="font-bold text-white">{t("feed.requestedAnInspection")}</Text>
    </View>
  )
}