import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Screen, Text } from "@components";
import { useUsersCount, useUserTypesCount } from "@domain";
import { useUserContext } from "@hooks";
import { AppStackParamsList } from "@routes";

import { UserItem } from "./components/UserItem";
import { COMMUNITY_TYPES, TYPE_COLOR } from "./communityRules";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "CommunityScreen">;

function TypeShare({ userType, total }: { userType: number; total: number }) {
  const { count } = useUserTypesCount({ userType });
  if (!total || !count) return null;
  return <View className={`h-3 ${TYPE_COLOR[userType]}`} style={{ flex: count }} />;
}

function Legend({ userType }: { userType: number }) {
  const { count } = useUserTypesCount({ userType });
  return (
    <View className="flex-row items-center gap-1">
      <View className={`w-2 h-2 rounded-full ${TYPE_COLOR[userType]}`} />
      <Text className="text-gray-300 text-[11px]">{count}</Text>
    </View>
  );
}

export function CommunityScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { isConnected, userType } = useUserContext();
  const { count } = useUsersCount();
  const { count: regeneratorsCount } = useUserTypesCount({ userType: 1 });

  return (
    <Screen title={t("community.title")} showBackButton scrollable>
      <View className="gap-4 mb-10">
        <View className="p-4 rounded-2xl bg-card-primary gap-3">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-gray-400 text-xs">{t("community.totalUsers")}</Text>
              <Text className="text-green-primary text-4xl font-bold">{count}</Text>
            </View>
            <View className="flex-row flex-wrap justify-end gap-2 max-w-[60%]">
              {COMMUNITY_TYPES.map(type => <Legend key={type} userType={type} />)}
            </View>
          </View>
          <View className="flex-row rounded-full overflow-hidden bg-card-secondary h-3">
            {COMMUNITY_TYPES.map(type => <TypeShare key={type} userType={type} total={count} />)}
          </View>
          <Text className="text-gray-300 text-sm">{t("community.description")}</Text>

          {isConnected && userType === 0 && (
            <TouchableOpacity
              className="h-11 rounded-2xl items-center justify-center bg-green-primary"
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text className="text-green-secondary font-bold">{t("community.join")}</Text>
            </TouchableOpacity>
          )}
        </View>

        {COMMUNITY_TYPES.map(type => (
          <UserItem key={type} userType={type as never} regeneratorsCount={regeneratorsCount} />
        ))}
      </View>
    </Screen>
  );
}
