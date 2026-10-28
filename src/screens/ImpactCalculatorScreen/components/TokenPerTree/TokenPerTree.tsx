import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, Text } from "@components";
import { useImpactPerToken } from "@domain";

export function TokenPerTree() {
  const { t, i18n } = useTranslation();
  const formatNumber = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);
  const { trees } = useImpactPerToken();

  // Calculate tokens per tree: 1 / trees per token
  const tokensPerTree = trees > 0 ? 1 / trees : 0;

  return (
    <View className="bg-green-900/50 border border-green-500 rounded-2xl p-4">
      <View className="flex-row items-center gap-2 mb-2">
        <Icon name='rc' />
        <Text className="text-green-400 font-bold text-lg">
          {t('impactCalculator.treeEqualsTokens', { tokens: formatNumber(tokensPerTree) })}
        </Text>
      </View>
      <Text className="text-gray-300 text-sm">
        {t('impactCalculator.tokensPerTreeDescription', { tokens: formatNumber(tokensPerTree) })}
      </Text>
    </View>
  );
}