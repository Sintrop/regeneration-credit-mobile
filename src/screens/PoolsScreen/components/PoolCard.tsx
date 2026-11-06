import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ProgressBar, Text } from "@components";
import { usePoolOverview } from "@domain";

import { POOL_NAME_KEY } from "../poolLabels";

interface Props {
  userType: number;
  isUserPool: boolean;
  onPress: (userType: number) => void;
}

export function PoolCard({ userType, isUserPool, onPress }: Props) {
  const { t, i18n } = useTranslation();
  const { overview, isLoading } = usePoolOverview(userType);
  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(value);

  return (
    <TouchableOpacity
      className={`p-4 rounded-2xl bg-card-primary gap-3 ${isUserPool ? "border border-green-primary" : ""}`}
      onPress={() => onPress(userType)}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-lg font-bold">{t(POOL_NAME_KEY[userType])}</Text>
        {isUserPool ? (
          <Text className="text-xs font-semibold px-3 py-1 rounded-full overflow-hidden bg-green-primary text-green-secondary">
            {t("pools.yourPool")}
          </Text>
        ) : (
          <Text className="text-green-primary text-lg">›</Text>
        )}
      </View>

      {isLoading || !overview ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <View className="gap-1">
            <View className="flex-row justify-between">
              <Text className="text-gray-300 text-xs">{t("pools.distributedOf", { distributed: format(overview.distributed), total: format(overview.totalTokens) })}</Text>
              <Text className="text-gray-300 text-xs">{Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(overview.distributedPercentage)}%</Text>
            </View>
            <ProgressBar value={overview.distributedPercentage} />
          </View>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-gray-400 text-xs">{t("pools.perEra")}</Text>
              <Text className="text-white font-semibold">{format(overview.tokensPerEra)} RC</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs">{t("pools.inPool")}</Text>
              <Text className="text-white font-semibold">{format(overview.balance)} RC</Text>
            </View>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}
