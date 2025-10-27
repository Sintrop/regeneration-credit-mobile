import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, Text } from "@components";
import { TxProps } from "@domain";

interface Props {
  tx: TxProps;
}
export function TxItem({ tx }: Props) {
  const { t } = useTranslation();

  return (
    <View className="p-3 rounded-2xl bg-card-primary w-full flex-row justify-between mb-1">
      <View className="flex-row gap-2">
        <View className="bg-white w-12 h-12 rounded-full items-center justify-center">
          <Icon
            name={tx.coin === 'RC' ? 'rc' : 'sin'}
            size={25}
          />
        </View>
        <View className="w-[150]">
          <Text className="text-gray-300 text-sm">
            {tx.type === 'RECEIVE' ? t('myTokens.from') : t('myTokens.to')}
          </Text>
          <Text className="text-white max-w-[90%]" numberOfLines={1} >
            {tx.type === 'RECEIVE' ? tx.from : tx.to}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-1">
        <Text className="font-semibold text-white">
          {Intl.NumberFormat('pt-BR').format(tx.value / 10 ** 18)}
        </Text>
        <Icon 
          name={tx.type === 'RECEIVE' ? 'arrowUp' : 'arrowDown'}
          color={tx.type === 'RECEIVE' ? 'green' : 'red'}
        />
      </View>
    </View>
  )
}
