import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { UserRegisteredProps, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { FeedBadge } from "../FeedBadge";

const USER_TYPE_KEY: Record<number, string> = { 1: "regenerator", 2: "inspector", 3: "researcher", 4: "developer", 5: "contributor", 6: "activist", 7: "supporter" };

export function UserRegistered({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const newUser = additionalData ? JSON.parse(additionalData) as UserRegisteredProps : null
  const { 
    user, 
    isLoading: isLoadingUser 
  } = useUserBasicData({ address: newUser ? newUser.address : '', userType: newUser ? newUser.userType : 0 });

  if (isLoadingUser) return <LoadingFeedItem />

  return (
    <View className="gap-3">
      <HeaderItem
        name={user?.name}
        address={newUser?.address}
        createdAt={newUser?.blockNumber}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <FeedBadge label={t("feedNews.newUserBadge")} tone="green" />
      <Text className="text-white text-base leading-6">
        {t("feedNews.newUser", { name: user?.name ?? "", type: t(`common.${USER_TYPE_KEY[newUser?.userType ?? 0] ?? "user"}`) })}
      </Text>
    </View>
  )
}
