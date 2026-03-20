import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { PieChart } from "react-native-gifted-charts";

import { Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";
import { usePoolData } from "@domain";

import { WithdrawArea } from "./components/WithdrawArea";
import { EraCard } from "./components/EraCard";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'PoolDetailsScreen'>
export function PoolDetailsScreen({ route }: ScreenProps) {
  const { t } = useTranslation();
  const { userType } = route.params;
  const { data } = usePoolData({ userType });

  const pieData = [
    { value: data?.balance ?? 0, color: '#75d63a' },
    { value: data?.usedTokens ?? 0, color: '#012939' },
  ];

  return (
    <Screen title={t('poolsDetailsScreen.title')} showBackButton scrollable>
      <View className="w-full p-3 rounded-2xl bg-card-primary gap-3 items-center">
        <Text preset="bold" className="text-white text-lg font-bold w-full">
          {userType === 1 && t('community.regenerators')}
          {userType === 2 && t('community.inspectors')}
          {userType === 3 && t('community.researchers')}
          {userType === 4 && t('community.developers')}
          {userType === 5 && t('community.contributors')}
          {userType === 6 && t('community.activists')}
        </Text>
        <PieChart
          radius={100}
          innerRadius={80}
          data={pieData}
          animationDuration={300}
          curvedEndEdges
          strokeWidth={2}
          strokeColor="#fff"
          isAnimated={true}
        />
        
        <View className="w-full gap-1">
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded-full bg-[#75d63a]"/>
            <Text className="text-white text-sm">Saldo disponível ({Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(data?.balancePercentage ?? 0)}%)</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded-full bg-[#012939]"/>
            <Text className="text-white text-sm">Tokens distribuídos</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mt-2">
          <CardData 
            title={t('poolsDetailsScreen.totalTokens')} 
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(data?.totalTokens ?? 0)}
            suffix="RC"
          />
          <CardData 
            title={t('poolsDetailsScreen.balance')} 
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(data?.balance ?? 0)}
            suffix="RC"
          />
        </View>
        <View className="flex-row gap-3">
          <CardData 
            title={t('poolsDetailsScreen.currentEra')} 
            value={data?.currentEra}
          />
          <CardData 
            title={t('poolsDetailsScreen.currentEpoch')} 
            value={data?.currentEpoch}
          />
        </View>
      </View>
      <WithdrawArea poolType={userType} poolEra={data?.currentEra ?? 0} />

      <EraCard userType={userType} currentEra={data?.currentEra ?? 0} />
    </Screen>
  );
}

interface CardDataProps {
  title: string;
  value?: string | number;
  suffix?: string;
  isLoading?: boolean;
  tagIndicator?: string;
}
function CardData({ value, title, suffix, tagIndicator }: CardDataProps) {
  return (
    <View className="flex-1 rounded-2xl p-5 gap-1 bg-card-secondary">
      <Text className="font-bold text-white text-xl">{value} {suffix && suffix}</Text>
      <View className="flex-row items-center gap-2">
        <Text className="text-gray-300 text-sm">{title}</Text>
        {tagIndicator && <View className={`w-4 h-4 rounded-full bg-[${tagIndicator}]`}/>}
      </View>
    </View>
  )
}