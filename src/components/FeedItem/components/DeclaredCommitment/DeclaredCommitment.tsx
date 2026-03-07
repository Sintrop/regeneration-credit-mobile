import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { OffsetProps, useGetCalculatorItem, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";

export function DeclaredCommitment({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const commitment = additionalData ? JSON.parse(additionalData) as OffsetProps : null
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: commitment?.address, userType: 7 });
  const { item } = useGetCalculatorItem({ itemId: commitment?.calculatorItemId ?? 1})

  if (!commitment) return <LoadingFeedItem />

  return (
    <View>
      <HeaderItem
        name={user?.name}
        address={commitment?.address}
        createdAt={commitment?.blockNumber}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <View className="my-3">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-bold text-white">{t("feed.declaredCommitmentItem")}</Text>
          
        </View>

        <View className="mt-3">
          <Text className="text-gray-300">{t('feed.declaredItem')}</Text>
          <Text className="text-white">{item?.item}</Text>
        </View>
      </View>
    </View>
  )
}
