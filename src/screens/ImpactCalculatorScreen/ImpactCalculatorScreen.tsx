import { useTranslation } from "react-i18next";

import { Screen } from "@components";
import { CalculatorItems } from "./components/CalculatorItems/CalculatorItems";

export function ImpactCalculatorScreen() {
  const { t } = useTranslation();

  return (
    <Screen title={t('impactCalculator.title')} scrollable showBackButton>
      <CalculatorItems />

    </Screen>
  )
}
