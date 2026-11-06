import { useMemo, useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

import { Icon, Screen, Text, TextInput } from "@components";
import { AppStackParamsList } from "@routes";
import { SINTROP_CHAIN_PARAMS } from "@services";

import { contractFunctions, getContractEntry } from "../../contracts/registry";
import { FunctionCard } from "./components/FunctionCard";

type Tab = "read" | "write";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "ContractScreen">;
export function ContractScreen({ route }: ScreenProps) {
  const { t } = useTranslation();
  const entry = getContractEntry(route.params.name);
  const functions = useMemo(() => (entry ? contractFunctions(entry) : { read: [], write: [] }), [entry]);
  const [tab, setTab] = useState<Tab>("read");
  const [query, setQuery] = useState("");

  if (!entry) {
    return (
      <Screen title={t("contracts.title")} showBackButton>
        <Text className="text-gray-300 text-center py-10">{t("contracts.notFound")}</Text>
      </Screen>
    );
  }

  const search = query.trim().toLowerCase();
  const list = functions[tab].filter(fn => !search || fn.name.toLowerCase().includes(search));

  function handleCopy() {
    Clipboard.setString(entry!.address);
    Toast.show({ type: "success", text1: t("common.addressCopied") });
  }

  return (
    <Screen title={entry.name} showBackButton scrollable>
      <View className="gap-4 pb-10">
        <View className="p-4 rounded-2xl bg-card-primary gap-3">
          {!!entry.notice && <Text className="text-gray-200 text-sm">{entry.notice}</Text>}
          <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-xl bg-card-secondary" onPress={handleCopy}>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs">{t("help.tokenAddress")}</Text>
              <Text className="text-white text-sm" selectable>{entry.address}</Text>
            </View>
            <Icon name="copy" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            className="self-start"
            onPress={() => Linking.openURL(`${SINTROP_CHAIN_PARAMS.blockExplorerUrls[0]}/address/${entry.address}`)}
            hitSlop={8}
          >
            <Text className="text-green-primary text-sm font-semibold">{t("contracts.viewOnExplorer")} ›</Text>
          </TouchableOpacity>
          {!!entry.notice && <Text className="text-gray-500 text-[11px]">{t("contracts.natspecNote")}</Text>}
        </View>

        <View className="flex-row p-1 rounded-2xl bg-card-primary">
          {(["read", "write"] as Tab[]).map(item => {
            const selected = item === tab;
            return (
              <TouchableOpacity
                key={item}
                className={`flex-1 h-10 rounded-xl items-center justify-center ${selected ? (item === "read" ? "bg-green-primary" : "bg-amber-400") : ""}`}
                onPress={() => setTab(item)}
              >
                <Text className={`font-semibold ${selected ? "text-green-secondary" : "text-white"}`}>
                  {t(`contracts.tab.${item}`)} ({functions[item].length})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {tab === "write" ? (
          <View className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 gap-1">
            <Text className="text-amber-300 font-semibold">{t("contracts.writeWarningTitle")}</Text>
            <Text className="text-gray-200 text-sm">{t("contracts.writeWarning")}</Text>
          </View>
        ) : (
          <Text className="text-gray-400 text-sm">{t("contracts.readHint")}</Text>
        )}

        <TextInput
          placeholder={t("contracts.searchFunction")}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {list.map(fn => (
          <FunctionCard key={`${tab}-${fn.name}-${fn.inputs.length}`} entry={entry} fn={fn} mode={tab} />
        ))}
        {list.length === 0 && <Text className="text-gray-300 text-center py-6">{t("contracts.noFunctions")}</Text>}
      </View>
    </Screen>
  );
}
