import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, Text } from "@components";
import { useImpactPerToken } from "@domain";

// Helper to format with 2 decimal places using comma as decimal separator
function formatNumber(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function TokenPerTree() {
  const { t } = useTranslation();
  const { trees } = useImpactPerToken();

  // Calculate tokens per tree: 1 / trees per token
  const tokensPerTree = trees > 0 ? 1 / trees : 0;

  return (
    <View className="bg-green-900/50 border border-green-500 rounded-2xl p-4">
      <View className="flex-row items-center gap-2 mb-2">
        <Icon name='rc' />
        <Text className="text-green-400 font-bold text-lg">
          1 Árvore = {formatNumber(tokensPerTree)} RCs
        </Text>
      </View>
      <Text className="text-gray-300 text-sm">
        No presente {formatNumber(tokensPerTree)} Créditos de Regeneração equivalem a 1 árvore
      </Text>
    </View>
  );
}