import { TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Icon, Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'PoolsScreen'>
export function PoolsScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();

  function handleGoToPoolDetail(userType: number) {
    navigation.navigate('PoolDetailsScreen', { userType });
  }

  return (
    <Screen title={t('poolsScreen.title')} scrollable showBackButton>
      <View className="w-full flex-row gap-5">
        <Btn userType={1} onPress={handleGoToPoolDetail} />
        <Btn userType={2} onPress={handleGoToPoolDetail} />
      </View>
      <View className="w-full flex-row gap-5 mt-5">
        <Btn userType={3} onPress={handleGoToPoolDetail} />
        <Btn userType={4} onPress={handleGoToPoolDetail} />
      </View>
      <View className="w-full flex-row gap-5 mt-5">
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
    <TouchableOpacity
      onPress={() => onPress(userType)}
      className="flex-1 h-32 rounded-2xl bg-card-primary p-5 items-center justify-center gap-1"
    >
      <Icon name="community" size={35} />
      <Text preset="semibold" className="text-white text-lg">
        {userType === 1 && t('community.regenerators')}
        {userType === 2 && t('community.inspectors')}
        {userType === 3 && t('community.researchers')}
        {userType === 4 && t('community.developers')}
        {userType === 5 && t('community.contributors')}
        {userType === 6 && t('community.activists')}
      </Text>
    </TouchableOpacity>
  );
}
