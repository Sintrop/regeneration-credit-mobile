import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Icon, IconsName, Text } from "@components";
import { AppStackParamsList } from "@routes";

import colors from "../../../theme/colors";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

type ShortcutRoute =
  | "MyTokensScreen"
  | "PoolsScreen"
  | "MarketScreen"
  | "ImpactCalculatorScreen"
  | "TokenImpactScreen"
  | "CommunityScreen"
  | "InspectionsScreen"
  | "ResourcesListScreen";

interface Shortcut {
  route: ShortcutRoute;
  icon: IconsName;
  label: string;
  color?: string;
}

const SHORTCUTS: Shortcut[] = [
  { route: "MyTokensScreen", icon: "tokens", label: "homeScreen.shortcuts.myTokens" },
  { route: "PoolsScreen", icon: "pools", label: "homeScreen.shortcuts.withdrawTokens" },
  { route: "MarketScreen", icon: "rc", label: "homeScreen.shortcuts.market" },
  { route: "ImpactCalculatorScreen", icon: "impactCalculator", label: "homeScreen.shortcuts.calculator" },
  { route: "TokenImpactScreen", icon: "rcStats", label: "homeScreen.shortcuts.impact" },
  { route: "CommunityScreen", icon: "community", label: "homeScreen.shortcuts.community" },
  { route: "InspectionsScreen", icon: "inspections", label: "homeScreen.shortcuts.inspections" },
  { route: "ResourcesListScreen", icon: "file", label: "homeScreen.shortcuts.resources", color: colors.green.primary },
];

const COLUMNS = 4;

export function HomeShortcuts() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className="flex-row flex-wrap gap-y-4 py-2">
      {SHORTCUTS.map(shortcut => (
        <TouchableOpacity
          key={shortcut.route}
          className="items-center gap-2"
          style={{ width: `${100 / COLUMNS}%` }}
          onPress={() => navigation.navigate(shortcut.route)}
          accessibilityRole="button"
          accessibilityLabel={t(shortcut.label)}
        >
          <View className="w-14 h-14 rounded-2xl items-center justify-center bg-card-primary border border-green-primary/20">
            <Icon name={shortcut.icon} size={28} color={shortcut.color} />
          </View>
          <Text className="text-white text-xs text-center px-1" numberOfLines={2}>
            {t(shortcut.label)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
