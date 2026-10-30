import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ProgressBar, Text } from "@components";
import { PoolOverview } from "@domain";
import { useBlocksDuration } from "@hooks";

import { POOL_DESCRIPTION_KEY, POOL_NAME_KEY } from "../../PoolsScreen/poolLabels";

export function PoolHero({ overview }: { overview: PoolOverview }) {
  const { t, i18n } = useTranslation();
  const formatBlocks = useBlocksDuration();
  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(value);

  return (
    <View className="p-4 rounded-2xl bg-card-primary gap-4">
      <View className="gap-1">
        <Text className="text-white text-xl font-bold">{t(POOL_NAME_KEY[overview.userType])}</Text>
        <Text className="text-gray-300 text-sm">{t(POOL_DESCRIPTION_KEY[overview.userType])}</Text>
      </View>

      <View className="gap-2">
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-gray-400 text-xs">{t("pools.distributed")}</Text>
            <Text className="text-green-primary text-2xl font-bold">{format(overview.distributed)} RC</Text>
          </View>
          <Text className="text-gray-300 text-sm">
            {Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(overview.distributedPercentage)}%
          </Text>
        </View>
        <ProgressBar value={overview.distributedPercentage} />
        <Text className="text-gray-400 text-xs">
          {t("pools.ofTotal", { total: format(overview.totalTokens), balance: format(overview.balance) })}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Stat label={t("poolsScreen.currentEra")} value={String(overview.currentEra)} />
        <Stat label={t("pools.perEra")} value={`${format(overview.tokensPerEra)} RC`} />
      </View>
      <View className="flex-row gap-3">
        <Stat label={t("pools.epoch")} value={String(overview.currentEpoch)} hint={t("pools.epochHint")} />
        <Stat label={t("pools.eraEndsIn")} value={formatBlocks(overview.blocksToNextEra).split(" (")[0]} />
      </View>
    </View>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <View className="flex-1 p-3 rounded-xl bg-card-secondary gap-1">
      <Text className="text-gray-400 text-xs">{label}</Text>
      <Text className="text-white font-bold">{value}</Text>
      {!!hint && <Text className="text-gray-500 text-[10px]">{hint}</Text>}
    </View>
  );
}
