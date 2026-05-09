import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useBalance } from "@domain";
import { useUserContext } from "@hooks";

//@ts-ignore
import RCIcon from "../../../assets/images/rc.png";
//@ts-ignore
import SINIcon from "../../../assets/images/sin.png";
import { useState } from "react";

interface BalanceProps {
  onTransfer?: () => void;
}

export function Balance({ onTransfer }: BalanceProps) {
  const { address, balanceSIN, isConnected } = useUserContext();
  const { t } = useTranslation();
  const { balance, isLoading: isLoadingRc } = useBalance({ address });

  const [showBalance, setShowBalance] = useState<boolean>(false);

  function handleToggleVisibility() {
    setShowBalance((value) => !value);
  }

  return (
    <View className="w-full p-5 rounded-2xl bg-card-primary">
      <Text className="text-gray-300 text-sm">{t('common.yourBalance')}</Text>

      <View className="gap-3 items-center flex-row mt-5">
        <Image source={RCIcon} className="w-10 h-10" resizeMode="contain"/>
        {isLoadingRc ? (
          <ActivityIndicator color="white" size={30} />
        ) : (
          <Text className="text-white text-2xl">
            {showBalance ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(balance) : '**********'} RC
          </Text>
        )}
      </View>

      <View className="gap-3 items-center flex-row mt-5">
        <Image source={SINIcon} className="w-10 h-10" resizeMode="contain"/>
        
        <Text className="text-white text-2xl">
          {showBalance ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(balanceSIN) : '**********'} SIN
        </Text>
      </View>

      <View className="flex-row items-center justify-center gap-4 mt-5">
        {isConnected ? (
          <>
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 h-8 px-4 bg-blue-600 rounded-lg"
              onPress={handleToggleVisibility}
              hitSlop={5}
            >
              <Text className="font-semibold text-white text-sm">
                {showBalance ? t('myTokens.hideBalance') : t('myTokens.showBalance')}
              </Text>
            </TouchableOpacity>
            
            {onTransfer && (
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 h-8 px-4 bg-green-600 rounded-lg"
                onPress={onTransfer}
                hitSlop={5}
              >
                <Text className="font-semibold text-white text-sm">
                  {t('myTokens.transfer')}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text className="text-white">{t('common.youAreNotConnected')}</Text>
        )}
      </View>
    </View>
  );
}
