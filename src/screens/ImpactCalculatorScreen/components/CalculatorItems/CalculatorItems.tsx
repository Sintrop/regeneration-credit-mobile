import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useCalculatorItemsList } from "@domain";
import { CalculatorItem } from "./CalculatorItem";

export function CalculatorItems() {
  const { t } = useTranslation();
  const { calculatorItems, isLoading } = useCalculatorItemsList();

  if (isLoading) {
    return (
      <View className="gap-2">
        <Text className="text-gray-300 text-sm">{t('impactCalculator.calculatorItems')}</Text>
        <ActivityIndicator color="white" size={50} />
      </View>
    )
  }

  return (
    <View className="gap-2">
      <Text className="text-gray-300 text-sm">{t('impactCalculator.calculatorItems')}</Text>
      
      <View className="bg-card-primary rounded-2xl overflow-hidden">
        <View className="flex-row items-center justify-between h-10 px-5 border-b border-card-secondary">
          <Text className="text-gray-300 text-sm">Item</Text>
        </View>

        {calculatorItems.map((item) => (
          <CalculatorItem item={item} key={item.id} />
        ))}
      </View>
    </View>
  )
}
