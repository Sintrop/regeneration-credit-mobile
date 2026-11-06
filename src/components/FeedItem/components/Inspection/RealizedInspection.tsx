import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text, StatBox } from "@components";
import { InspectorData } from "./InspectorData";

interface Props {
  inspectorAddress: string;
  score: number;
  treesResult: number;
  biodiversityResult: number
}
export function RealizedInspection({ inspectorAddress, biodiversityResult, score, treesResult }: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between px-3 h-10 rounded-2xl border-2 border-green-600">
        <Text className="font-bold text-green-600">{t("feed.realizedInspection")}</Text>
      </View>
      
      <InspectorData address={inspectorAddress} />

      <View className="flex-row justify-between gap-5 mt-3">
        <StatBox 
          title={t("feed.rScore")}
          value={score}
        />

        <StatBox 
          title={t("common.biodiversity")}
          value={biodiversityResult}
        />

        <StatBox 
          title={t("common.trees")}
          value={treesResult}
        />
      </View>
    </View>
  )
}
