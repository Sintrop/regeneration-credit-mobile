import { ActivityIndicator, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Screen } from "@components";
import { AppStackParamsList } from "@routes";
import { usePoolOverview } from "@domain";
import { useUserContext } from "@hooks";

import { PoolHero } from "./components/PoolHero";
import { UserPositionCard } from "./components/UserPositionCard";
import { EraSection } from "./components/EraSection";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "PoolDetailsScreen">;
export function PoolDetailsScreen({ route, navigation }: ScreenProps) {
  const { t } = useTranslation();
  const { userType } = route.params;
  const { userType: connectedType } = useUserContext();
  const { overview, isLoading, refetch } = usePoolOverview(userType);

  return (
    <Screen title={t("poolsDetailsScreen.title")} showBackButton scrollable>
      {isLoading || !overview ? (
        <ActivityIndicator color="white" className="mt-10" />
      ) : (
        <View className="gap-4 pb-8">
          <PoolHero overview={overview} />
          {connectedType === userType && <UserPositionCard overview={overview} onWithdrawn={refetch} />}
          <EraSection overview={overview} onPressUser={address => navigation.navigate("UserDetailsScreen", { address })} />
        </View>
      )}
    </Screen>
  );
}
