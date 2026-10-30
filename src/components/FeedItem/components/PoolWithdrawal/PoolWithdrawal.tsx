import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";

import { PoolWithdrawalProps, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";
import { FeedBadge } from "../FeedBadge";

const poolTypeKeys: Record<number, string> = {
  1: 'common.regenerator',
  2: 'common.inspector',
  3: 'common.researcher',
  4: 'common.developer',
  5: 'common.contributor',
  6: 'common.activist',
};

export function PoolWithdrawal({ additionalData }: BaseComponentsProps) {
  const { t, i18n } = useTranslation();
  const withdrawal = additionalData ? JSON.parse(additionalData) as PoolWithdrawalProps : null;
  
  // Determinar o userType baseado no poolType
  const userType = withdrawal?.poolType || 1;
  const { user, isLoading: isLoadingUser } = useUserBasicData({ 
    address: withdrawal?.user, 
    userType 
  });

  if (!withdrawal) return <LoadingFeedItem />

  const isZeroWithdrawal = withdrawal.amount === 0;

  return (
    <View className="gap-3">
      <HeaderItem
        name={user?.name}
        address={withdrawal?.user}
        createdAt={withdrawal?.blockNumber}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <FeedBadge label={t("feedNews.withdrawBadge", { pool: t(poolTypeKeys[withdrawal?.poolType] ?? "common.user") })} tone="green" />
      {isZeroWithdrawal ? (
        <Text className="text-white text-base leading-6">{t("feed.advancedToEra", { era: (withdrawal?.era || 0) + 1 })}</Text>
      ) : (
        <View className="flex-row items-center gap-3">
          <Image source={RCLogo} className="w-9 h-9" resizeMode="contain" />
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">
              {Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(withdrawal?.amount / 10 ** 18)} RC
            </Text>
            <Text className="text-gray-300 text-sm">{t("feed.poolPaymentDescription", { era: withdrawal?.era })}</Text>
          </View>
        </View>
      )}
    </View>
  )
}
