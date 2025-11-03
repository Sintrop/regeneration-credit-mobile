import { useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppSafeArea, useKeyboardStatus, useUserContext } from "@hooks";
import { Text, TextInput } from "@components";
import { useBalance, useBurn } from "@domain";

//@ts-ignore
import RCIcon from "../../../../assets/images/rc.png";
import { utils } from "web3";

export function BurnTokensModalContent() {
  const { address } = useUserContext();
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();
  const { keyboardHeight, keyboardOpen } = useKeyboardStatus();
  const paddingBottom = keyboardOpen ? keyboardHeight + 100 : bottom + 20;

  const { balance, isLoading } = useBalance({ address });

  const [inputTokens, setInputTokens] = useState('');
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  const { burnTokens } = useBurn();

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

  async function handleBurn() {
    const value = utils.toWei(inputTokens, 'ether');
    burnTokens({ value: parseFloat(value) });
  }

  return (
    <View 
      className="w-full p-5 bg-card-primary rounded-t-2xl"
      style={{ paddingBottom }}
    >
      <Text className="text-white text-center">{t('actions.burnTokens')}</Text>

      <Text className="text-white mt-10">
        {t('actionsDescriptions.burnTokens')}
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
          label={t('actions.howMuchDoYouWantToBurn')}
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
        onPress={handleBurn}
      >
        <Text className="text-white font-semibold">{t('actions.burnTokens')}</Text>
      </TouchableOpacity>
    </View>
  )
}
