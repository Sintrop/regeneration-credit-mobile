import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";
import { usePoolOverview } from "@domain";
import { useBlocksDuration, useUserContext } from "@hooks";

import { PoolCard } from "./components/PoolCard";
import { POOL_TYPES } from "./poolLabels";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "PoolsScreen">;
export function PoolsScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();
  const { userType } = useUserContext();
  const formatBlocks = useBlocksDuration();
  const { overview } = usePoolOverview(1);

  const ordered = POOL_TYPES.includes(userType)
    ? [userType, ...POOL_TYPES.filter(type => type !== userType)]
    : POOL_TYPES;

  return (
    <Screen title={t("poolsScreen.title")} scrollable showBackButton>
      <View className="w-full gap-4 pb-6">
        <View className="p-4 rounded-2xl bg-card-primary gap-2">
          <Text className="text-white font-bold">{t("pools.howItWorksTitle")}</Text>
          <Text className="text-gray-300 text-sm">{t("pools.howItWorks")}</Text>
          {overview && (
            <View className="flex-row justify-between mt-2 pt-3 border-t border-card-secondary">
              <View>
                <Text className="text-gray-400 text-xs">{t("poolsScreen.currentEra")}</Text>
                <Text className="text-white font-semibold">{overview.currentEra}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-400 text-xs">{t("pools.eraEndsIn")}</Text>
                <Text className="text-white font-semibold">{formatBlocks(overview.blocksToNextEra)}</Text>
              </View>
            </View>
          )}
        </View>

        {ordered.map(type => (
          <PoolCard
            key={type}
            userType={type}
            isUserPool={type === userType}
            onPress={selected => navigation.navigate("PoolDetailsScreen", { userType: selected })}
          />
        ))}
      </View>
    </Screen>
  );
}
