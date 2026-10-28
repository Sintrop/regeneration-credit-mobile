import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text, TextInput } from "@components";
import { useCalculatorItemsList, useImpactPerToken } from "@domain";
import { useUserContext } from "@hooks";

import { CalculatorItem } from "./CalculatorItem";

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function CalculatorItems() {
  const { t } = useTranslation();
  const { userType } = useUserContext();
  const { calculatorItems, isLoading } = useCalculatorItemsList();
  const { carbon } = useImpactPerToken();
  const [search, setSearch] = useState("");

  const visible = search.trim()
    ? calculatorItems.filter(item => normalize(`${item.item} ${item.unit}`).includes(normalize(search.trim())))
    : calculatorItems;

  return (
    <View className="gap-3">
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-lg font-bold">{t("impactCalculator.calculatorItems")}</Text>
          {!isLoading && <Text className="text-gray-400 text-sm">{calculatorItems.length}</Text>}
        </View>
        <Text className="text-gray-300 text-sm">{t("impactCalculator.descOffset")}</Text>
        {userType !== 7 && (
          <Text className="text-gray-400 text-xs">{t("impactCalculator.supporterOnly")}</Text>
        )}
      </View>

      {calculatorItems.length > 4 && (
        <TextInput value={search} onChangeText={setSearch} placeholder={t("impactCalculator.searchItem")} />
      )}

      {isLoading ? (
        <ActivityIndicator color="white" size={40} />
      ) : visible.length === 0 ? (
        <Text className="text-gray-400 text-center py-6">{t("impactCalculator.noItems")}</Text>
      ) : (
        visible.map(item => <CalculatorItem item={item} carbonPerToken={carbon} key={item.id} />)
      )}
    </View>
  );
}
