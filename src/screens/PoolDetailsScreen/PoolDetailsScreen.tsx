import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { PieChart } from "react-native-gifted-charts";

import { Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";
import { usePoolData } from "@domain";

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
      <View className="w-full p-3 rounded-2xl bg-card-primary gap-3 items-center pt-10">
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

        <View className="flex-row gap-3 mt-10">
          <CardData 
            title={t('poolsDetailsScreen.totalTokens')} 
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(data?.totalTokens ?? 0)}
            suffix="RC"
            tagIndicator="#75d63a"
          />
          <CardData 
            title={t('poolsDetailsScreen.balance')} 
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(data?.balance ?? 0)}
            suffix="RC"
            tagIndicator="#012939"
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