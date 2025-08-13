import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { InspectorData } from "./InspectorData";

interface Props {
  inspectorAddress: string;
}
export function AcceptedInspection({ inspectorAddress }: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between px-3 h-10 rounded-2xl bg-blue-400">
        <Text className="font-bold text-white">{t("feed.acceptedInspection")}</Text>
      </View>
      
      <InspectorData address={inspectorAddress} />
    </View>
  )
}