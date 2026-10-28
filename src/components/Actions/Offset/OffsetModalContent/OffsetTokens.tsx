/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, TextInput as RNTextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { useTxContext, useUserContext } from "@hooks";
import { CalculatorItemProps, useBalance, useImpactPerToken } from "@domain";
import { Text, TextInput } from "@components";
import { SupporterRules } from "@contracts";
import { amountToWei, applyPercentageDiscount, parseAmountInput, requiredAmountToInput } from "@utils";

//@ts-ignore
import RCIcon from "../../../../assets/images/rc.png";

// Helper to format with 2 decimal places using comma as decimal separator
function formatNumber(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

interface Props {
  refetchApprovedTokens: () => void;
  approvedTokens: number;
  item: CalculatorItemProps;
  onDone?: () => void;
}
export function OffsetTokens({ refetchApprovedTokens, approvedTokens, item, onDone }: Props) {
  const { t } = useTranslation();
  const { address } = useUserContext();
  const { balance, isLoading } = useBalance({ address });
  const { registerContinueAction, sendTransaction } = useTxContext();
  const { carbon: carbonPerToken } = useImpactPerToken();

  const [inputTokens, setInputTokens] = useState('');
  const [inputUnits, setInputUnits] = useState('');
  const [description, setDescription] = useState('');
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  // tokens = units * item carbon impact [g/unit] / carbon per token [g/RC]
  function calculateTokensNeeded(units: string): number {
    const parsedUnits = parseAmountInput(units);
    const carbonImpactValue = Number(item?.carbonImpact) || 0;
    const carbonPerTokenValue = Number(carbonPerToken) || 0;

    if (!(parsedUnits > 0) || carbonPerTokenValue <= 0 || carbonImpactValue <= 0) return 0;
    return (parsedUnits * carbonImpactValue) / carbonPerTokenValue;
  }

  const tokensNeeded = calculateTokensNeeded(inputUnits);

  function handleChangeUnits(units: string) {
    setInputUnits(units);
    const needed = calculateTokensNeeded(units);
    if (needed > 0) setInputTokens(requiredAmountToInput(needed));
  }

  function onTxSuccess() {
    Toast.show({
      type: 'success',
      text1: t('offset.madeOffset')
    });
    refetchApprovedTokens();
    onDone?.();
  }

  useEffect(() => {
    if (inputTokens.trim()) {
      if (parseAmountInput(inputTokens) > Math.min(balance, approvedTokens)) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }
    } else {
      setInsufficientBalance(false);
    }
  }, [balance, approvedTokens, inputTokens]);

  const valueInWei = amountToWei(inputTokens);
  const isValidAmount = valueInWei !== null && BigInt(valueInWei) > 0n;

  async function handleOffset() {
    if (!valueInWei || !isValidAmount) return;
    registerContinueAction(onTxSuccess);
    const commissionPercentage = 5;
    const minAmountToBurn = applyPercentageDiscount(valueInWei, commissionPercentage);

    sendTransaction({
      interactWithContract: true,
      contractAbi: SupporterRules.abi,
      contractAddress: SupporterRules.address,
      methodName: 'offset',
      params: [valueInWei, minAmountToBurn, item.id, description]
    })
  }

  return (
    <View className="mt-5">
      <Text className="text-gray-300 text-sm text-center">
        {t('offset.title')}
      </Text>

      <View className="mt-3 gap-3">
        <Text className="text-white">
          {t('offset.approvedTokens')}
        </Text>

        <View className="flex-row items-center gap-3">
              <Image source={RCIcon} className="w-10 h-10" resizeMode="contain"/>
              
              <Text className="text-white text-2xl">
                {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(approvedTokens)} RC
              </Text>
            </View>

            <View className="gap-2 mb-3 p-3 bg-gray-800 rounded-xl">
              <Text className="text-white font-semibold">{item.item}</Text>
              <Text className="text-gray-400 text-sm">
                {t('offset.itemImpact', { impact: item.carbonImpact, unit: item.unit })}
              </Text>
            </View>

            {/* Calculator Section */}
            <View className="border border-green-500 rounded-xl p-3 bg-green-900/20">
              <Text className="text-white text-sm mb-2">
                {t('offset.howManyUnitsToOffset', { unit: item.unit })}
              </Text>
              <RNTextInput
                className="bg-transparent text-white h-10 px-3 rounded-lg mb-2 border border-gray-500"
                placeholderTextColor="#666"
                placeholder={`Ex: 10`}
                value={inputUnits}
                onChangeText={handleChangeUnits}
                keyboardType="decimal-pad"
              />
              {tokensNeeded > 0 && (
                <Text className="text-green-400 font-semibold">
                  {t('common.compensateTokens', { tokens: formatNumber(tokensNeeded) })}
                </Text>
              )}
            </View>

        <TextInput
          label={t('offset.howMuchDoYouWantToOffsetForThisItem')}
          value={inputTokens}
          onChangeText={setInputTokens}
          placeholder={t('common.typeHere')}
          keyboardType="decimal-pad"
        />

        {insufficientBalance && (
          <Text className="text-red-400">{t('offset.insufficientApprovedTokens')}!</Text>
        )}

        <TextInput
          label={t('offset.labelInputDescription')}
          value={description}
          onChangeText={setDescription}
          placeholder={t('common.typeHere')}
          multiline={true}
        />
      </View>

      <TouchableOpacity
        className="w-full h-12 items-center justify-center bg-blue-primary rounded-2xl mt-5 disabled:opacity-50"
        disabled={isLoading || insufficientBalance || !isValidAmount}
        onPress={handleOffset}
      >
        <Text className="text-white font-semibold">{t('offset.title')}</Text>
      </TouchableOpacity>
    </View>
  )
}
