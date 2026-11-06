import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { Text } from "@components";
import { PoolOverview, usePoolUserPosition, useWithdraw } from "@domain";
import { useBlocksDuration, useTxContext } from "@hooks";

interface Props {
  overview: PoolOverview;
  onWithdrawn: () => void;
}

/** Connected user's era in the pool, the estimate for the next withdraw() and the button. */
export function UserPositionCard({ overview, onWithdrawn }: Props) {
  const { t, i18n } = useTranslation();
  const formatBlocks = useBlocksDuration();
  const { registerContinueAction } = useTxContext();
  const { withdraw } = useWithdraw();
  const { position, isLoading, refetch } = usePoolUserPosition(overview.userType, overview.currentEra, overview.totalTokens);
  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);

  if (isLoading) {
    return <View className="p-4 rounded-2xl bg-card-primary"><ActivityIndicator color="white" /></View>;
  }
  if (!position) return null;

  function handleWithdraw() {
    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("pools.withdrawDone") });
      refetch();
      onWithdrawn();
    });
    withdraw({ userType: overview.userType });
  }

  const ready = position.canWithdraw && position.minimumInspectionsMet;
  const emptyEra = position.estimatedTokens <= 0;

  return (
    <View className="p-4 rounded-2xl bg-card-primary border border-green-primary/40 gap-3">
      <Text className="text-white font-bold">{t("pools.yourPosition")}</Text>

      {position.pendingTokens > 0 && position.minimumInspectionsMet && (
        <View className="gap-1">
          <Text className="text-gray-400 text-xs">{t("pools.toReceive")}</Text>
          <Text className="text-green-primary text-3xl font-bold">~{format(position.pendingTokens)} RC</Text>
          <Text className="text-gray-400 text-xs">{t("pools.inWithdrawals", { count: position.pendingEras })}</Text>
        </View>
      )}

      <View className="flex-row gap-3">
        <View className="flex-1 p-3 rounded-xl bg-card-secondary">
          <Text className="text-gray-400 text-xs">{t("pools.yourEra")}</Text>
          <Text className="text-white font-bold text-lg">{position.userEra}</Text>
        </View>
        <View className="flex-1 p-3 rounded-xl bg-card-secondary">
          <Text className="text-gray-400 text-xs">{t("pools.levelsThisEra", { era: overview.currentEra })}</Text>
          <Text className="text-white font-bold text-lg">{position.currentEraLevels}</Text>
        </View>
      </View>

      {!position.minimumInspectionsMet ? (
        <Text className="text-amber-300 text-sm">{t("timers.blocked.minimumInspections")}</Text>
      ) : position.canWithdraw ? (
        <View className="p-3 rounded-xl bg-green-primary/10 gap-1">
          <Text className="text-gray-300 text-xs">{t("pools.nextWithdraw", { era: position.userEra })}</Text>
          {emptyEra ? (
            <Text className="text-white text-sm">{t("pools.emptyEra", { era: position.userEra, next: position.userEra + 1 })}</Text>
          ) : (
            <>
              <Text className="text-white text-xl font-bold">~{format(position.estimatedTokens)} RC</Text>
              <Text className="text-gray-400 text-xs">
                {t("pools.estimateDetail", { levels: position.userLevelsInEra, total: position.eraLevels })}
              </Text>
            </>
          )}
        </View>
      ) : (
        <Text className="text-gray-300 text-sm">
          {t("pools.waitEraEnd", { era: position.userEra, duration: formatBlocks(position.blocksToUserEraEnd) })}
        </Text>
      )}

      {ready && (
        <TouchableOpacity className="h-12 rounded-2xl items-center justify-center bg-green-primary" onPress={handleWithdraw}>
          <Text className="text-green-secondary font-bold">
            {emptyEra ? t("pools.advanceEra", { next: position.userEra + 1 }) : t("pools.withdrawEra", { era: position.userEra })}
          </Text>
        </TouchableOpacity>
      )}

      {ready && position.userEra + 1 < overview.currentEra && (
        <Text className="text-gray-400 text-xs">{t("pools.oneEraPerWithdraw", { count: overview.currentEra - position.userEra })}</Text>
      )}
    </View>
  );
}
