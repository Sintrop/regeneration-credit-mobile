import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Path, Svg } from "react-native-svg";

import { Text } from "@components";
import { useSettingsContext } from "@hooks";
import { AppStackParamsList } from "@routes";

import { resolveLanguage } from "../../lang/languages";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList>;

const GEAR = "M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54A.48.48 0 0 0 13.92 2h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.72 8.47a.48.48 0 0 0 .12.61l2.03 1.58c-.04.31-.07.63-.07.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z";

/** Header shortcut to Settings (language and RPC), showing the current language and an RPC warning dot. */
export function SettingsButton() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { rpcUnstable } = useSettingsContext();

  return (
    <TouchableOpacity
      className="h-8 px-2.5 flex-row items-center gap-1.5 rounded-2xl border border-white/40"
      onPress={() => navigation.navigate("SettingsScreen")}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={t("settings.title")}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24"><Path d={GEAR} fill="white" /></Svg>
      <Text className="text-white text-xs font-semibold">{resolveLanguage(i18n.language).toUpperCase()}</Text>
      {rpcUnstable && <View className="w-2 h-2 rounded-full bg-amber-400" />}
    </TouchableOpacity>
  );
}
