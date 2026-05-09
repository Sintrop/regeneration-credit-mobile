import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@components";

import { CalculatorItems } from "./components/CalculatorItems/CalculatorItems";
import { BurnTokens } from "./components/BurnTokens";
import { TokenImpact } from "./components/TokenImpact/TokenImpact";
import { TokenPerTree } from "./components/TokenPerTree/TokenPerTree";

export function ImpactCalculatorScreen() {
  const { t } = useTranslation();

  return (
    <Screen title={t('impactCalculator.title')} scrollable showBackButton>
      <View className="gap-5">
        <TokenPerTree />
        <TokenImpact />
        <BurnTokens />
        <CalculatorItems />
      </View>
    </Screen>
  )
}
