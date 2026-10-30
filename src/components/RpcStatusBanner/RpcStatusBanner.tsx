import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text } from "@components";
import { useSettingsContext } from "@hooks";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList>;

/** Shown on every screen while the configured RPC fails its health check. */
export function RpcStatusBanner({ onSettingsScreen }: { onSettingsScreen?: boolean }) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { rpcUnstable, recheckRpc } = useSettingsContext();

  if (!rpcUnstable) return null;

  return (
    <View className="mx-3 mt-3 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 gap-2">
      <Text className="text-amber-300 font-bold">{t("rpcStatus.title")}</Text>
      <Text className="text-gray-200 text-sm">{t("rpcStatus.description")}</Text>
      <View className="flex-row gap-2 mt-1">
        {!onSettingsScreen && (
          <TouchableOpacity className="flex-1 h-10 rounded-xl items-center justify-center bg-amber-400" onPress={() => navigation.navigate("SettingsScreen")}>
            <Text className="text-green-secondary font-bold text-sm">{t("rpcStatus.changeRpc")}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="flex-1 h-10 rounded-xl items-center justify-center border border-amber-400" onPress={recheckRpc}>
          <Text className="text-amber-300 font-semibold text-sm">{t("rpcStatus.retry")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
