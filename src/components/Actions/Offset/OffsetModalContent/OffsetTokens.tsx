/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, Keyboard, TextInput as RNTextInput } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { utils } from "web3";

import { useKeyboardStatus, useTxContext, useUserContext } from "@hooks";
import { CalculatorItemProps, useBalance, useImpactPerToken } from "@domain";
import { Text, TextInput } from "@components";
import { SupporterRules } from "@contracts";

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
}
export function OffsetTokens({ refetchApprovedTokens, approvedTokens, item }: Props) {
  const { t } = useTranslation();
  const { address } = useUserContext();
  const { balance, isLoading } = useBalance({ address });
  const { registerContinueAction, sendTransaction } = useTxContext();
  const { keyboardOpen } = useKeyboardStatus();
  const { carbon: carbonPerToken } = useImpactPerToken();

  const [inputTokens, setInputTokens] = useState('');
  const [inputUnits, setInputUnits] = useState('');
  const [description, setDescription] = useState('');
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  // Calculate tokens needed based on units and carbon impact
  // Formula: (unidades * impacto em gramas por unidade) / impacto por token em gramas
  const parsedUnits = parseFloat(inputUnits.replace(',', '.'));
  const tokensNeeded = !isNaN(parsedUnits) && parsedUnits > 0 && carbonPerToken > 0
    ? (parsedUnits * Number(item.carbonImpact)) / carbonPerToken
    : 0;

  useEffect(() => {
    registerContinueAction(() => {
      Toast.show({
        type: 'success',
        text1: t('offset.madeOffset')
      });
      refetchApprovedTokens();
    })
  }, []);

  useEffect(() => {
    if (inputTokens.trim()) {
      if (parseFloat(inputTokens) > balance) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }
    } else {
      setInsufficientBalance(false);
    }
  }, [balance, inputTokens]);

  async function handleOffset() {
    const commissionPercentage = 5;
    const value = utils.toWei(inputTokens, 'ether');
    const minAmmountToBurn = parseFloat(inputTokens) * (1 - commissionPercentage / 100);
    const minAmmountToBurnParsed = utils.toWei(minAmmountToBurn.toString(), 'ether');

    sendTransaction({
      interactWithContract: true,
      contractAbi: SupporterRules.abi,
      contractAddress: SupporterRules.address,
      methodName: 'offset',
      params: [parseFloat(value), parseFloat(minAmmountToBurnParsed), item.id, description]
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

        {!keyboardOpen && (
          <>
            <View className="flex-row items-center gap-3">
              <Image source={RCIcon} className="w-10 h-10" resizeMode="contain"/>
              
              <Text className="text-white text-2xl">
                {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(approvedTokens)} RC
              </Text>
            </View>

            <View className="gap-2 mb-3 p-3 bg-gray-800 rounded-xl">
              <Text className="text-white font-semibold">{item.item}</Text>
              <Text className="text-gray-400 text-sm">
                Impacto: {item.carbonImpact} g CO2/{item.unit}
              </Text>
            </View>

            {/* Calculator Section */}
            <View className="border border-green-500 rounded-xl p-3 bg-green-900/20">
              <Text className="text-white text-sm mb-2">
                Quantos {item.unit} deseja compensar?
              </Text>
              <RNTextInput
                className="bg-transparent text-white h-10 px-3 rounded-lg mb-2 border border-gray-500"
                placeholderTextColor="#666"
                placeholder={`Ex: 10`}
                value={inputUnits}
                onChangeText={setInputUnits}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {tokensNeeded > 0 && (
                <Text className="text-green-400 font-semibold">
                  Compense {formatNumber(tokensNeeded)} Créditos de Regeneração
                </Text>
              )}
            </View>
          </>
        )}

        <TextInput
          label={t('offset.howMuchDoYouWantToOffsetForThisItem')}
          value={inputTokens}
          onChangeText={setInputTokens}
          placeholder={t('common.typeHere')}
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => Keyboard.dismiss()}
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
        disabled={isLoading || insufficientBalance || !inputTokens.trim()}
        onPress={handleOffset}
      >
        <Text className="text-white font-semibold">{t('offset.title')}</Text>
      </TouchableOpacity>
    </View>
  )
}
