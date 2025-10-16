import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useUserContext } from "@hooks";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamsList } from "@routes";
import { useNavigation } from "@react-navigation/native";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">

export function UserWithoutRegister() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { userType, isConnected } = useUserContext();

  function handleGoToRegister() {
    navigation.navigate("RegisterScreen");
  }

  if (true) {
    return (
      <View className="border-2 border-white rounded-2xl w-full p-3">
        <Text className="text-white font-semibold">{t('home.userWithoutRegister')}</Text>
        <Text className="text-gray-300">{t('home.descriptionRegsiter')}</Text>

        <TouchableOpacity
          className="w-full h-12 rounded-2xl items-center justify-center bg-blue-primary mt-3"
          onPress={handleGoToRegister}
        >
          <Text className="font-semibold text-white">{t('home.register')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return <View />
}