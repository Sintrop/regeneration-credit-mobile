import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@components";

import { CalculatorItems } from "./components/CalculatorItems/CalculatorItems";
import { BurnTokens } from "./components/BurnTokens";
import { TokenImpact } from "./components/TokenImpact/TokenImpact";

export function ImpactCalculatorScreen() {
  const { t } = useTranslation();

  return (
    <Screen title={t('impactCalculator.title')} scrollable showBackButton>
      <View className="gap-5">
        <TokenImpact />
        <BurnTokens />
        <CalculatorItems />
      </View>
    </Screen>
  )
}
