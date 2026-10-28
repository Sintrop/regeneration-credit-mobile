import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { Screen, Text, TextInput } from "@components";
import { useSettingsContext, useUserContext } from "@hooks";
import { DEFAULT_RPC } from "@services";
import { AppStackParamsList } from "@routes";

import { changeAppLanguage } from "../../lang/i18n";
import { LanguageCode, SUPPORTED_LANGUAGES, resolveLanguage } from "../../lang/languages";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "SettingsScreen">;
export function SettingsScreen({ navigation }: ScreenProps) {
  const { t, i18n } = useTranslation();
  const { rpc, isDefaultRpc, rpcHealth, changeRpc, resetRpc, recheckRpc } = useSettingsContext();
  const { address, isConnected, handleDisconnect } = useUserContext();
  const [customRpc, setCustomRpc] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = resolveLanguage(i18n.language);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await changeRpc(customRpc);
    setSaving(false);
    if (result.ok) {
      setCustomRpc("");
      Toast.show({ type: "success", text1: t("settings.rpcSaved") });
    } else {
      setError(t(`settings.rpcError.${result.error}`));
    }
  }

  async function handleReset() {
    await resetRpc();
    Toast.show({ type: "success", text1: t("settings.rpcRestored") });
  }

  return (
    <Screen title={t("settings.title")} showBackButton scrollable>
      <View className="gap-4 pb-10">
        <View className="p-4 rounded-2xl bg-card-primary gap-3">
          <Text className="text-white font-bold text-lg">{t("common.language")}</Text>
          <View className="flex-row gap-2">
            {SUPPORTED_LANGUAGES.map(language => {
              const selected = language.code === current;
              return (
                <TouchableOpacity
                  key={language.code}
                  className={`flex-1 h-11 rounded-xl items-center justify-center ${selected ? "bg-green-primary" : "bg-card-secondary"}`}
                  onPress={() => changeAppLanguage(language.code as LanguageCode)}
                >
                  <Text className={`font-semibold ${selected ? "text-green-secondary" : "text-white"}`}>{language.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="p-4 rounded-2xl bg-card-primary gap-3">
          <Text className="text-white font-bold text-lg">{t("settings.network")}</Text>
          <Text className="text-gray-300 text-sm">{t("settings.rpcDescription")}</Text>

          <View className="p-3 rounded-xl bg-card-secondary gap-1">
            <Text className="text-gray-400 text-xs">{t("settings.currentRpc")}{isDefaultRpc ? ` · ${t("settings.default")}` : ""}</Text>
            <Text className="text-white" numberOfLines={1}>{rpc}</Text>
            {!rpcHealth ? (
              <ActivityIndicator color="white" className="self-start mt-1" />
            ) : rpcHealth.ok ? (
              <Text className="text-green-primary text-xs">
                {t("settings.rpcOnline", { ms: rpcHealth.latencyMs, block: Intl.NumberFormat(i18n.language).format(rpcHealth.blockNumber ?? 0) })}
              </Text>
            ) : (
              <Text className="text-red-300 text-xs">{t(`settings.rpcError.${rpcHealth.error}`)}</Text>
            )}
            <TouchableOpacity onPress={recheckRpc} className="self-start mt-1" hitSlop={8}>
              <Text className="text-green-primary text-xs font-semibold">{t("settings.testAgain")}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            label={t("settings.customRpc")}
            placeholder="https://"
            value={customRpc}
            onChangeText={value => { setCustomRpc(value); setError(null); }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {!!error && <Text className="text-red-300 text-sm">{error}</Text>}

          <TouchableOpacity
            className="h-12 rounded-2xl items-center justify-center bg-green-primary disabled:opacity-40"
            disabled={!customRpc.trim() || saving}
            onPress={handleSave}
          >
            {saving ? <ActivityIndicator color="white" /> : <Text className="text-green-secondary font-bold">{t("settings.testAndSave")}</Text>}
          </TouchableOpacity>

          {!isDefaultRpc && (
            <TouchableOpacity className="h-11 rounded-2xl items-center justify-center border border-green-primary" onPress={handleReset}>
              <Text className="text-green-primary font-semibold">{t("settings.restoreDefault", { rpc: DEFAULT_RPC })}</Text>
            </TouchableOpacity>
          )}

          <Text className="text-gray-500 text-xs">{t("settings.chainNote")}</Text>
        </View>

        {isConnected && (
          <View className="p-4 rounded-2xl bg-card-primary gap-2">
            <Text className="text-white font-bold text-lg">{t("settings.wallet")}</Text>
            <Text className="text-gray-400 text-xs">{t("settings.connectedWallet")}</Text>
            <Text className="text-white text-sm" numberOfLines={1} ellipsizeMode="middle">{address}</Text>
            <TouchableOpacity onPress={handleDisconnect} className="self-start mt-1" hitSlop={8}>
              <Text className="text-red-300 text-sm font-semibold">{t("settings.disconnect")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          className="flex-row items-center justify-between p-4 rounded-2xl bg-card-primary"
          onPress={() => navigation.navigate("HelpScreen")}
        >
          <View className="flex-1 gap-1">
            <Text className="text-white font-bold text-lg">{t("help.title")}</Text>
            <Text className="text-gray-300 text-sm">{t("help.settingsLink")}</Text>
          </View>
          <Text className="text-green-primary text-xl">›</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
