import { TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'PoolsScreen'>
export function PoolsScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();

  function handleGoToPoolDetail(userType: number) {
    navigation.navigate('PoolDetailsScreen', { userType });
  }

  return (
    <Screen title={t('poolsScreen.title')} scrollable showBackButton>
      <View className="w-full gap-5">
        <Btn userType={1} onPress={handleGoToPoolDetail} />
        <Btn userType={2} onPress={handleGoToPoolDetail} />
        <Btn userType={3} onPress={handleGoToPoolDetail} />
        <Btn userType={4} onPress={handleGoToPoolDetail} />
        <Btn userType={5} onPress={handleGoToPoolDetail} />
        <Btn userType={6} onPress={handleGoToPoolDetail} />
      </View>
    </Screen>
  );
}

interface BtnProps {
  userType: number;
  onPress: (userType: number) => void;
}
function Btn({ onPress, userType }: BtnProps) {
  const { t } = useTranslation();

  return (
    <View
      className="flex-1 rounded-2xl bg-card-primary p-5 justify-center gap-1"
    >
      <Text preset="bold" className="text-white text-lg font-bold">
        {userType === 1 && t('community.regenerators')}
        {userType === 2 && t('community.inspectors')}
        {userType === 3 && t('community.researchers')}
        {userType === 4 && t('community.developers')}
        {userType === 5 && t('community.contributors')}
        {userType === 6 && t('community.activists')}
      </Text>

      <Text className="text-gray-300">
        {userType === 1 && t('poolsScreen.descRegeneratorPool')}
        {userType === 2 && t('poolsScreen.descInspectorsPool')}
        {userType === 3 && t('poolsScreen.descResearchersPool')}
        {userType === 4 && t('poolsScreen.descDevelopersPool')}
        {userType === 5 && t('poolsScreen.descContributorsPool')}
        {userType === 6 && t('poolsScreen.descActivistsPool')}
      </Text>

      <TouchableOpacity
        onPress={() => onPress(userType)}
        className="w-fit px-5 rounded-2xl bg-blue-primary py-2 flex-row items-center justify-center gap-2 mt-5"
      >
        <Text className="font-semibold text-white">Acessar</Text>
      </TouchableOpacity>
    </View>
  );
}
