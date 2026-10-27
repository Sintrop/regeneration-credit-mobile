import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ProgressBar, Text, UserBadge } from "@components";
import { PoolOverview, usePoolEraDetails } from "@domain";

interface Props {
  overview: PoolOverview;
  onPressUser: (address: string) => void;
}

/** Per-era distribution: tokens of the era, how much was withdrawn and who withdrew. */
export function EraSection({ overview, onPressUser }: Props) {
  const { t, i18n } = useTranslation();
  const lastClosedEra = Math.max(1, overview.currentEra - 1);
  const [era, setEra] = useState(lastClosedEra);
  const { details, isLoading } = usePoolEraDetails(overview.userType, era, overview.currentEra, overview.totalTokens);
  const format = (value: number, digits = 0) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value);

  useEffect(() => setEra(lastClosedEra), [lastClosedEra]);

  const eras = Array.from({ length: overview.currentEra }, (_, index) => overview.currentEra - index);

  return (
    <View className="gap-3">
      <Text className="text-white text-lg font-bold">{t("pools.erasTitle")}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {eras.map(item => {
          const selected = item === era;
          const current = item === overview.currentEra;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setEra(item)}
              className={`px-4 h-9 rounded-full items-center justify-center ${selected ? "bg-green-primary" : "bg-card-primary"}`}
            >
              <Text className={`font-semibold text-sm ${selected ? "text-green-secondary" : "text-white"}`}>
                {t("pools.eraChip", { era: item })}{current ? ` · ${t("pools.now")}` : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View className="p-4 rounded-2xl bg-card-primary gap-4">
        {isLoading || !details ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className={`self-start text-xs font-semibold px-3 py-1 rounded-full overflow-hidden ${details.phase === "current" ? "bg-blue-primary/20 text-blue-primary" : "bg-green-primary/20 text-green-primary"}`}>
              {details.phase === "current" ? t("pools.phaseCurrent") : t("pools.phaseClaimable")}
            </Text>

            <View className="gap-2">
              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-gray-400 text-xs">{t("pools.withdrawnInEra")}</Text>
                  <Text className="text-white text-xl font-bold">{format(details.withdrawnTokens)} RC</Text>
                </View>
                <Text className="text-gray-300 text-sm">{format(details.withdrawnPercentage, 1)}%</Text>
              </View>
              <ProgressBar value={details.withdrawnPercentage} />
              <Text className="text-gray-400 text-xs">{t("pools.eraTokens", { tokens: format(details.tokensToDistribute) })}</Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 p-3 rounded-xl bg-card-secondary">
                <Text className="text-gray-400 text-xs">{t("pools.levels")}</Text>
                <Text className="text-white font-bold">{details.levels}</Text>
              </View>
              <View className="flex-1 p-3 rounded-xl bg-card-secondary">
                <Text className="text-gray-400 text-xs">{t("pools.withdrawalsCount")}</Text>
                <Text className="text-white font-bold">{details.claimsCount}</Text>
              </View>
            </View>

            <View className="gap-3">
              <Text className="text-gray-300 text-sm font-semibold">{t("pools.whoWithdrew")}</Text>
              {details.withdrawals.length === 0 ? (
                <Text className="text-gray-400 text-sm">
                  {details.phase === "current" ? t("pools.noWithdrawalsCurrent") : t("pools.noWithdrawals")}
                </Text>
              ) : (
                details.withdrawals.map(item => (
                  <View key={`${item.user}-${item.blockNumber}`} className="flex-row items-center gap-3">
                    <View className="flex-1">
                      <UserBadge address={item.user} label={t("common.block") + " " + item.blockNumber} onPress={onPressUser} />
                    </View>
                    <Text className={`font-bold ${item.amount > 0 ? "text-green-primary" : "text-gray-400"}`}>
                      {item.amount > 0 ? `${format(item.amount)} RC` : t("pools.advancedOnly")}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}
