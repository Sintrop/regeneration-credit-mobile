import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";

import { PoolWithdrawalProps, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";

const poolTypeNames: Record<number, string> = {
  1: 'Regenerador',
  2: 'Inspetor',
  3: 'Pesquisador',
  4: 'Desenvolvedor',
  5: 'Contribuidor',
  6: 'Ativista',
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
          <Text className="font-bold text-white">{isZeroWithdrawal ? `Avançou para a fase ${(withdrawal?.era || 0) + 1}` : 'Créditos Recebidos'}</Text>
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
              Pagamento de Créditos de Regeneração pelos serviços prestados na fase {withdrawal?.era}
            </Text>
            <Text className="text-white mt-1">
              {poolTypeNames[withdrawal?.poolType] || 'Usuário'}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
