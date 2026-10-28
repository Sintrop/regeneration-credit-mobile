import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text } from "@components";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList>;

/** Header shortcut to the help screen (getting started, network data, contracts and FAQ). */
export function HelpButton() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      className="h-8 w-8 items-center justify-center rounded-full border border-white/40"
      onPress={() => navigation.navigate("HelpScreen")}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={t("help.title")}
    >
      <Text className="text-white font-bold">?</Text>
    </TouchableOpacity>
  );
}
