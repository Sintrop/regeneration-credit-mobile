import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";

import { OffsetProps, useGetCalculatorItem, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";

export function Offset({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const offset = additionalData ? JSON.parse(additionalData) as OffsetProps : null
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: offset?.address, userType: 7 });
  const { item } = useGetCalculatorItem({ itemId: offset?.calculatorItemId ?? 1})

  if (!offset) return <LoadingFeedItem />

  return (
    <View>
      <HeaderItem
        name={user?.name}
        address={offset?.address}
        createdAt={offset?.blockNumber}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <View className="my-3">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-bold text-white">{t("feed.burnedTokens")}</Text>
          <View className="flex-row items-center gap-3">
            <Image source={RCLogo} className="w-7 h-7" resizeMode="contain"/>
            <Text className="font-bold text-white">
              {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 5}).format(offset?.amountBurned / 10 ** 18)}
            </Text>
          </View>
        </View>

        {offset?.message && offset.message !== "" && (
          <Text className="text-white mt-3">{offset.message}</Text>
        )}

        <View className="mt-3">
          <Text className="text-gray-300">{t('feed.compensatedItem')}</Text>
          <Text className="text-white">{item?.item}</Text>
        </View>
      </View>
    </View>
  )
}
