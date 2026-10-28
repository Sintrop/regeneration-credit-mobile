import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { OffsetProps, useGetCalculatorItem, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { FeedBadge } from "../FeedBadge";

export function DeclaredCommitment({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const commitment = additionalData ? JSON.parse(additionalData) as OffsetProps : null
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: commitment?.address, userType: 7 });
  const { item } = useGetCalculatorItem({ itemId: commitment?.calculatorItemId ?? 1})

  if (!commitment) return <LoadingFeedItem />

  return (
    <View className="gap-3">
      <HeaderItem
        name={user?.name}
        address={commitment?.address}
        createdAt={commitment?.blockNumber}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <FeedBadge label={t("feedNews.commitmentBadge")} tone="teal" />
      <Text className="text-white text-base leading-6">
        {t("feedNews.commitment", { item: item?.item ?? "" })}
      </Text>
    </View>
  )
}
