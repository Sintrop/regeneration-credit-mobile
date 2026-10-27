import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";

import { PoolWithdrawalProps, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";

const poolTypeKeys: Record<number, string> = {
  1: 'common.regenerator',
  2: 'common.inspector',
  3: 'common.researcher',
  4: 'common.developer',
  5: 'common.contributor',
  6: 'common.activist',
};

export function PoolWithdrawal({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
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
    <View>
      <HeaderItem
        name={user?.name}
        address={withdrawal?.user}
        createdAt={withdrawal?.blockNumber}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <View className="my-3">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-bold text-white">{isZeroWithdrawal ? t('feed.advancedToEra', { era: (withdrawal?.era || 0) + 1 }) : t('feed.creditsReceived')}</Text>
          {!isZeroWithdrawal && (
            <View className="flex-row items-center gap-3">
              <Image source={RCLogo} className="w-7 h-7" resizeMode="contain"/>
              <Text className="font-bold text-white">
                {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(withdrawal?.amount / 10 ** 18)} RC
              </Text>
            </View>
          )}
        </View>

        {!isZeroWithdrawal && (
          <View className="mt-3">
            <Text className="text-gray-300">
              {t('feed.poolPaymentDescription', { era: withdrawal?.era })}
            </Text>
            <Text className="text-white mt-1">
              {t(poolTypeKeys[withdrawal?.poolType] ?? 'common.user')}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
