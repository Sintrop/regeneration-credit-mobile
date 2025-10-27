import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { UserRegisteredProps, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text, UserTypeText } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";

export function UserRegistered({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const newUser = additionalData ? JSON.parse(additionalData) as UserRegisteredProps : null
  const { 
    user, 
    isLoading: isLoadingUser 
  } = useUserBasicData({ address: newUser ? newUser.address : '', userType: newUser ? newUser.userType : 0 });

  if (isLoadingUser) return <LoadingFeedItem />

  return (
    <View>
      <HeaderItem
        name={user?.name}
        address={newUser?.address}
        createdAt={newUser?.blockNumber}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <View className="my-3 relative">
        <Text className="font-bold text-white mb-2">{t("feed.newUser")}</Text>
        <Text className="text-white">
          {t('feed.theUser')}{' '}
          <Text className="font-semibold text-green-600">{user?.name} </Text>
          {t('feed.registeredAs')}{' '}
          {/* @ts-ignore  */}
          {newUser?.userType && <UserTypeText userType={newUser?.userType} className="text-green-600 font-semibold"/>}
        </Text>
      </View>
    </View>
  )
}
