import { TouchableOpacity, View } from "react-native";
import { useSDK } from "@metamask/sdk-react";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useUserContext } from "@hooks";

export function ChainSwitch() {
  const { chainId } = useSDK();
  const { switchToSintropChain } = useUserContext();
  const { t } = useTranslation();
  const chain = parseInt(chainId ?? '0', 16);

  if (chain !== 250225) {
    return (
      <View className="p-3 rounded-2xl bg-white gap-3">
        <Text className="">{t('common.youAreAnotherChain')}</Text>
        <TouchableOpacity
          className="w-full h-12 rounded-2xl items-center justify-center bg-green-primary"
          onPress={switchToSintropChain}
        >
          <Text className="text-white font-semibold">{t('common.switchToSintrop')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Text>CHAIN ID: {chain}</Text>
  )
}
