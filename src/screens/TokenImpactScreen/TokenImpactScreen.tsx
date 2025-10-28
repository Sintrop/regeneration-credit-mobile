import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@components";

import { TokenData } from "./components/TokenData";
import { ImpactPerToken } from "./components/ImpactPerToken";
import { TotalImpact } from "./components/TotalImpact";
import { ImpactPerEra } from "./components/ImpactPerEra";

export function TokenImpactScreen() {
  const { t } = useTranslation();
  
  return (
    <Screen title={t('tokenImpact.title')} showBackButton scrollable>
      <View className="gap-5 mb-10">
        <TokenData />
        <ImpactPerToken />
        <TotalImpact />
        <ImpactPerEra />
      </View>
    </Screen>
  )
}