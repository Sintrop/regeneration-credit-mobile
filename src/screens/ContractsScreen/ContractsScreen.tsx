import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen, Text, TextInput } from "@components";
import { AppStackParamsList } from "@routes";
import { CONTRACT_GROUPS, CONTRACT_REGISTRY, contractFunctions } from "../../contracts/registry";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "ContractsScreen">;
export function ContractsScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const contracts = useMemo(() => CONTRACT_REGISTRY.map(entry => ({ entry, ...contractFunctions(entry) })), []);
  const search = query.trim().toLowerCase();
  const visible = search
    ? contracts.filter(({ entry, read, write }) =>
      entry.name.toLowerCase().includes(search) ||
      entry.address.toLowerCase().includes(search) ||
      [...read, ...write].some(fn => fn.name.toLowerCase().includes(search)))
    : contracts;

  return (
    <Screen title={t("contracts.title")} showBackButton scrollable>
      <View className="gap-4 pb-10">
        <View className="p-4 rounded-2xl bg-card-primary gap-2">
          <Text className="text-white font-bold text-lg">{t("contracts.introTitle")}</Text>
          <Text className="text-gray-300 text-sm">{t("contracts.introText")}</Text>
        </View>

        <TextInput
          placeholder={t("contracts.searchPlaceholder")}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {CONTRACT_GROUPS.map(group => {
          const items = visible.filter(item => item.entry.group === group);
          if (items.length === 0) return null;
          return (
            <View key={group} className="gap-2">
              <Text className="text-gray-400 text-xs font-semibold uppercase">{t(`contracts.groups.${group}`)}</Text>
              {items.map(({ entry, read, write }) => (
                <TouchableOpacity
                  key={entry.name}
                  className="flex-row items-center gap-3 p-4 rounded-2xl bg-card-primary"
                  onPress={() => navigation.navigate("ContractScreen", { name: entry.name })}
                  activeOpacity={0.8}
                >
                  <View className="flex-1 gap-0.5">
                    <Text className="text-white font-semibold">{entry.name}</Text>
                    <Text className="text-gray-400 text-xs">{shortAddress(entry.address)}</Text>
                  </View>
                  <View className="items-end gap-0.5">
                    <Text className="text-green-primary text-xs">{t("contracts.readCount", { count: read.length })}</Text>
                    <Text className="text-amber-300 text-xs">{t("contracts.writeCount", { count: write.length })}</Text>
                  </View>
                  <Text className="text-green-primary text-xl">›</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {visible.length === 0 && (
          <Text className="text-gray-300 text-center py-10">{t("contracts.noResults")}</Text>
        )}
      </View>
    </Screen>
  );
}
