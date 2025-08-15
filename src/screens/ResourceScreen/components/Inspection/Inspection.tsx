import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetInspection } from "@domain";
import { DataItem, Text } from "@components";

import { Regenerator } from "./Regenerator";
import { Inspector } from "./Inspector";
import { Reports } from "./Reports";

interface Props {
  id: number
}
export function Inspection({ id }: Props) {
  const { t } = useTranslation();
  const { inspection } = useGetInspection({ inspectionId: id });

  return (
    <View className="p-3 gap-3">
      <View className="p-3 rounded-2xl bg-card-primary gap-1">
        <Text className="text-gray-300 text-sm">
          {t("resourceScreen.inspectionData")}
        </Text>

        <View className="flex-row justify-between gap-5 my-3">
          <ResultItem 
            title={t("resourceScreen.rScore")}
            value={inspection?.regenerationScore}
          />
  
          <ResultItem 
            title={t("common.biodiversity")}
            value={inspection?.biodiversityResult}
          />
  
          <ResultItem 
            title={t("common.trees")}
            value={inspection?.treesResult}
          />
        </View>

        <DataItem title="ID" value={id} />
        <DataItem title={t("resourceScreen.createdAt")} value={inspection?.createdAt} />
        <DataItem title={t("resourceScreen.acceptedAt")} value={inspection?.acceptedAt} />
        <DataItem title={t("resourceScreen.inspectedAt")} value={inspection?.inspectedAt} />
        <DataItem title={t("resourceScreen.inspectedAtEra")} value={inspection?.inspectedAtEra} />
        <DataItem title={t("resourceScreen.validationsCount")} value={inspection?.validationsCount} />
      </View>

      {inspection && (
        <View className="gap-3">
          <Regenerator address={inspection.regenerator} />
          <Inspector address={inspection.inspector} />
          <Reports 
            proofPhotos={inspection.proofPhotos} 
            justificationReport={inspection.justificationReport}
          />
        </View>
      )}
    </View>
  )
}

interface ResultItemProps {
  title: string;
  value?: string | number;
}
function ResultItem({ title, value }: ResultItemProps) {
  return (
    <View className="w-28 p-3 border-2 border-white rounded-2xl items-center">
      <Text className="font-bold text-white text-4xl">{value}</Text>
      <Text className="text-sm text-white text-center">{title}</Text>
    </View>
  )
}