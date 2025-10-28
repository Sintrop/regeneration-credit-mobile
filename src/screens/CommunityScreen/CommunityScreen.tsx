import { Screen, Text } from "@components";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { UserItem } from "./components/UserItem";
import { useUsersCount } from "@domain";

export function CommunityScreen(){
  const { t } = useTranslation();
  const { count } = useUsersCount();

  return (
    <Screen title={t('community.title')} showBackButton scrollable>
      <View className="gap-5 mb-10">
        <View className="p-3 rounded-2xl bg-card-primary flex-row justify-between">
          <Text className="text-white max-w-[65%]">{t('community.description')}</Text>

          <View className="w-28 h-28 bg-card-secondary rounded-2xl items-center justify-center">
            <Text className="font-bold text-green-500 text-5xl">{count}</Text>
            <Text className="text-gray-300 text-center text-sm">
              {t('community.totalUsers')}
            </Text>
          </View>
        </View>

        <UserItem userType={1} />
        <UserItem userType={2} />
        <UserItem userType={3} />
        <UserItem userType={4} />
        <UserItem userType={5} />
        <UserItem userType={6} />
        <UserItem userType={7} />
      </View>
    </Screen>
  )
}
