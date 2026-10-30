import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { formatArea } from "@utils";

/** RegeneratorRules: 3 inspections to enter the pool, 6 completes the mission. */
const MINIMUM_INSPECTIONS_TO_POOL = 3;
const MAXIMUM_INSPECTIONS = 6;

interface Props {
  totalInspections: number;
  score: number;
  totalArea: number;
  lastTrees?: number;
  pendingInspection: boolean;
}

export function RegeneratorSummary({ totalInspections, score, totalArea, lastTrees, pendingInspection }: Props) {
  const { t, i18n } = useTranslation();
  const inPool = totalInspections >= MINIMUM_INSPECTIONS_TO_POOL;
  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(value);

  const status = totalInspections >= MAXIMUM_INSPECTIONS
    ? t("regeneratorProfile.statusComplete")
    : inPool
      ? t("regeneratorProfile.statusEarning")
      : t("regeneratorProfile.statusToPool", { count: MINIMUM_INSPECTIONS_TO_POOL - totalInspections });

  return (
    <View className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 gap-4">
      <View className="gap-1">
        <Text className="text-gray-300 text-sm">{t("regeneratorProfile.journey")}</Text>
        <Text className={`font-bold ${inPool ? "text-green-primary" : "text-white"}`}>{status}</Text>
        {pendingInspection && <Text className="text-amber-300 text-xs">{t("regeneratorProfile.pendingInspection")}</Text>}
      </View>

      <View className="gap-2">
        <View className="flex-row gap-1">
          {Array.from({ length: MAXIMUM_INSPECTIONS }, (_, index) => {
            const done = index < totalInspections;
            return (
              <View key={index} className="flex-1 items-center gap-1">
                <View className={`h-2 w-full rounded-full ${done ? "bg-green-primary" : "bg-card-secondary"}`} />
                <Text className={`text-[10px] ${index === MINIMUM_INSPECTIONS_TO_POOL - 1 ? "text-green-primary" : "text-gray-500"}`}>
                  {index + 1}{index === MINIMUM_INSPECTIONS_TO_POOL - 1 ? " · pool" : ""}
                </Text>
              </View>
            );
          })}
        </View>
        <Text className="text-gray-400 text-xs">{t("regeneratorProfile.inspectionsDone", { done: totalInspections, total: MAXIMUM_INSPECTIONS })}</Text>
      </View>

      <View className="flex-row gap-2">
        <Stat label={t("profile.regenerationScore")} value={format(score)} />
        <Stat label={t("profile.totalArea")} value={formatArea(totalArea, i18n.language)} />
        <Stat label={t("regeneratorProfile.lastTrees")} value={lastTrees !== undefined ? format(lastTrees) : "-"} />
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 p-3 rounded-xl bg-card-secondary">
      <Text className="text-white font-bold">{value}</Text>
      <Text className="text-gray-400 text-[11px]">{label}</Text>
    </View>
  );
}
