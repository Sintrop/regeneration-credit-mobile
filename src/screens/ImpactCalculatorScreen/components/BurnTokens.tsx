import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text, BurnTokens as ActionBurn } from "@components";
import { useUserContext } from "@hooks";

export function BurnTokens() {
  const { t } = useTranslation();

  return (
    <View className="p-3 bg-card-primary rounded-2xl">
      <Text className="text-gray-300 text-sm">{t('impactCalculator.burnTokens')}</Text>
      <Text className="text-white mb-3">{t('impactCalculator.descBurnTokens')}</Text>
      
      <ActionBurn>
        <BurnButton />
      </ActionBurn>
    </View>
  )
}

interface BurnButtonProps {
  openModal?: () => void;
}
function BurnButton({ openModal }: BurnButtonProps) {
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
        {isConnected ? t('actions.burnTokens') : t('common.youAreNotConnected')}
      </Text>
    </TouchableOpacity>
  )
}
