import { useState } from "react";
import { TouchableOpacity, View, TextInput as RNTextInput } from "react-native";
import { useTranslation } from "react-i18next";

import { Text, BurnTokens as ActionBurn } from "@components";
import { useUserContext } from "@hooks";
import { useImpactPerToken } from "@domain";

// Helper to format with 2 decimal places using comma as decimal separator
function formatNumber(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function BurnTokens() {
  const { t } = useTranslation();
  const { trees } = useImpactPerToken();
  
  // Calculate tokens per tree: 1 / trees per token
  const tokensPerTree = trees > 0 ? 1 / trees : 0;
  
  const [treeAmount, setTreeAmount] = useState('');

  // Calculate tokens needed for the entered tree amount
  const parsedAmount = parseFloat(treeAmount.replace(',', '.'));
  const tokensNeeded = !isNaN(parsedAmount) && parsedAmount > 0 
    ? parsedAmount * tokensPerTree 
    : 0;

  return (
    <View>
      <Text className="text-white">{t('impactCalculator.burnTokens')}</Text>
      <View className="p-3 bg-card-primary rounded-2xl mt-1 gap-3">
        <Text className="text-white mb-1">{t('impactCalculator.descBurnTokens')}</Text>
        
        {/* Calculator Section */}
        <View className="border border-green-500 rounded-xl p-3 bg-green-900/20">
          <Text className="text-white text-sm mb-2">Quantas árvores deseja financiar?</Text>
          <RNTextInput
            className="bg-transparent text-white h-10 px-3 rounded-lg mb-2 border border-gray-500"
            placeholderTextColor="#666"
            placeholder="Ex: 10 ou 10,5"
            value={treeAmount}
            onChangeText={setTreeAmount}
            keyboardType="numeric"
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => {}}
          />
          {tokensNeeded > 0 && (
            <Text className="text-green-400 font-semibold">
              Compense {formatNumber(tokensNeeded)} Créditos de Regeneração
            </Text>
          )}
        </View>

        <ActionBurn>
          <BurnButton tokensNeeded={tokensNeeded} />
        </ActionBurn>
      </View>
    </View>
  )
}

interface BurnButtonProps {
  openModal?: () => void;
  tokensNeeded: number;
}
function BurnButton({ openModal, tokensNeeded }: BurnButtonProps) {
  const { isConnected } = useUserContext();
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      onPress={openModal}
      className="w-full h-10 rounded-2xl bg-blue-primary items-center justify-center disabled:opacity-50"
      hitSlop={5}
      disabled={!isConnected}
    >
      <Text className="text-white font-semibold">
        {isConnected ? t('actions.compensate') : t('common.youAreNotConnected')}
      </Text>
    </TouchableOpacity>
  )
}