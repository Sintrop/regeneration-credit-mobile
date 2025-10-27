/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { utils } from "web3";

import { useTxContext, useUserContext } from "@hooks";
import { useBalance } from "@domain";
import { Text, TextInput } from "@components";
import { RegenerationCredit, SupporterRules } from "@contracts";

//@ts-ignore
import RCIcon from "../../../../assets/images/rc.png";

interface Props {
  refetchApprovedTokens: () => void;
}
export function ApproveTokens({ refetchApprovedTokens }: Props) {
  const { t } = useTranslation();
  const { address } = useUserContext();
  const { balance, isLoading } = useBalance({ address });
  const { registerContinueAction, sendTransaction } = useTxContext();

  const [inputTokens, setInputTokens] = useState('');
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  useEffect(() => {
    registerContinueAction(() => {
      Toast.show({
        type: 'success',
        text1: t('offset.approvedTokens')
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

  async function handleApprove() {
    const value = utils.toWei(inputTokens, 'ether');
    sendTransaction({
      interactWithContract: true,
      contractAbi: RegenerationCredit.abi,
      contractAddress: RegenerationCredit.address,
      methodName: 'approve',
      params: [SupporterRules.address, parseFloat(value)]
    })
  }

  return (
    <View className="mt-5">
      <Text className="text-gray-300 text-sm text-center">
        {t('offset.approveTokens')}
      </Text>

      <View className="mt-3 gap-2">
        <Text className="text-white">
          {t('common.yourBalance')}
        </Text>

        <View className="flex-row items-center gap-3 mb-3">
          <Image source={RCIcon} className="w-10 h-10" resizeMode="contain"/>
          {isLoading ? (
            <ActivityIndicator color="white" size={30} />
          ) : (
            <Text className="text-white text-2xl">
              {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(balance)} RC
            </Text>
          )}
        </View>

        <TextInput
          label={t('offset.howMuchDoYouWantToApprove')}
          value={inputTokens}
          onChangeText={setInputTokens}
          placeholder={t('common.typeHere')}
          keyboardType="numeric"
        />

        {insufficientBalance && (
          <Text className="text-red-400">{t('common.insufficientBalance')}!</Text>
        )}
      </View>

      <TouchableOpacity
        className="w-full h-12 items-center justify-center bg-blue-primary rounded-2xl mt-5 disabled:opacity-50"
        disabled={isLoading || insufficientBalance || !inputTokens.trim()}
        onPress={handleApprove}
      >
        <Text className="text-white font-semibold">{t('offset.approveTokens')}</Text>
      </TouchableOpacity>
    </View>
  )
}
