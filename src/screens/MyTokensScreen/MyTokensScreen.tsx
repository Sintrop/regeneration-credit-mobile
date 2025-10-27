import { useTranslation } from "react-i18next";

import { Screen } from "@components";
import { View } from "react-native";
import { Balance } from "./components/Balance";

export function MyTokensScreen() {
  const { t } = useTranslation();

  return (
    <Screen title={t('myTokens.title')} showBackButton>
      <View className="p-5">
        <Balance />
      </View>
    </Screen>
  );
}
