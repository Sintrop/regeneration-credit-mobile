import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList>
export function useResetNavigation() {
  const navigation = useNavigation<NavigationProps>();

  function resetToHomeScreen() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }]
    });
  };

  return {
    resetToHomeScreen
  }
}
