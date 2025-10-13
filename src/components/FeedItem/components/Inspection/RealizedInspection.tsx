import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
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
        <ResultItem 
          title={t("feed.rScore")}
          value={score}
        />

        <ResultItem 
          title={t("common.biodiversity")}
          value={biodiversityResult}
        />

        <ResultItem 
          title={t("common.trees")}
          value={treesResult}
        />
      </View>
    </View>
  )
}

interface ResultItemProps {
  title: string;
  value: string | number;
}
function ResultItem({ title, value }: ResultItemProps) {
  return (
    <View className="w-28 p-3 border-2 border-white rounded-2xl items-center">
      <Text className="font-bold text-white text-4xl">{value}</Text>
      <Text className="text-sm text-white text-center">{title}</Text>
    </View>
  )
}