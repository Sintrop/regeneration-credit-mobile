import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text } from "@components";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

export function NewcomerCard() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 p-4 mb-4 rounded-2xl bg-green-primary/10 border border-green-primary/40"
      onPress={() => navigation.navigate("HelpScreen")}
      activeOpacity={0.8}
    >
      <View className="w-9 h-9 rounded-full bg-green-primary items-center justify-center">
        <Text className="text-green-secondary font-bold text-lg">?</Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold">{t("help.newcomerTitle")}</Text>
        <Text className="text-gray-300 text-sm">{t("help.newcomerText")}</Text>
      </View>
      <Text className="text-green-primary text-xl">›</Text>
    </TouchableOpacity>
  );
}
