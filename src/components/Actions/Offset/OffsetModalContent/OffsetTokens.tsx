/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { utils } from "web3";

import { useTxContext, useUserContext } from "@hooks";
import { CalculatorItemProps, useBalance } from "@domain";
import { Text, TextInput } from "@components";
import { SupporterRules } from "@contracts";

//@ts-ignore
import RCIcon from "../../../../assets/images/rc.png";

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

  const [inputTokens, setInputTokens] = useState('');
  const [description, setDescription] = useState('');
  const [insufficientBalance, setInsufficientBalance] = useState(false);

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

        <View className="flex-row items-center gap-3">
          <Image source={RCIcon} className="w-10 h-10" resizeMode="contain"/>
          
          <Text className="text-white text-2xl">
            {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(approvedTokens)} RC
          </Text>
        </View>

        <View className="gap-2 mb-3">
          <Text className="text-white">
            {t('offset.calculatorItem')}
          </Text>

          <View className="flex items-center justify-between w-full">
            <Text className="text-white">{item.item}</Text>

            <Text className="text-white">
              {item.carbonImpact} g CO2/{item.unit}
            </Text>
          </View>
        </View>

        <TextInput
          label={t('offset.howMuchDoYouWantToOffsetForThisItem')}
          value={inputTokens}
          onChangeText={setInputTokens}
          placeholder={t('common.typeHere')}
          keyboardType="numeric"
        />

        {insufficientBalance && (
          <Text className="text-red-400">{t('common.insufficientApprovedTokens')}!</Text>
        )}

        <TextInput
          label={t('offset.labelInputDescription')}
          value={description}
          onChangeText={setDescription}
          placeholder={t('common.typeHere')}
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
