import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";
import { PublishedResource, PublishedResourceType, usePublishedResources } from "@domain";
import { useAppSafeArea } from "@hooks";

import { ResourceCard } from "./components/ResourceCard";

type Filter = "all" | PublishedResourceType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "resourcesList.filterAll" },
  { value: "research", label: "resourcesList.researches" },
  { value: "contribution", label: "resourcesList.contributions" },
  { value: "report", label: "resourcesList.reports" },
];

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "ResourcesListScreen">;
export function ResourcesListScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();
  const { resources, isLoading, isError, isRefetching, refetch } = usePublishedResources();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: resources.length, research: 0, contribution: 0, report: 0 };
    resources.forEach(resource => { result[resource.type] += 1; });
    return result;
  }, [resources]);

  const visible = filter === "all" ? resources : resources.filter(resource => resource.type === filter);

  function handleOpen(resource: PublishedResource) {
    navigation.navigate("ResourceScreen", { id: resource.id, resourceType: resource.type });
  }

  function handleOpenAuthor(address: string) {
    navigation.navigate("UserDetailsScreen", { address });
  }

  return (
    <Screen title={t("resourcesList.title")} showBackButton>
      <View className="flex-1">
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingVertical: 12 }}
          >
            {FILTERS.map(item => {
              const selected = item.value === filter;
              return (
                <TouchableOpacity
                  key={item.value}
                  className={`h-9 px-4 rounded-full flex-row items-center gap-2 ${selected ? "bg-green-primary" : "bg-card-primary"}`}
                  onPress={() => setFilter(item.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text className={`text-sm font-semibold ${selected ? "text-green-secondary" : "text-white"}`}>
                    {t(item.label)}
                  </Text>
                  {!isLoading && (
                    <Text className={`text-xs ${selected ? "text-green-secondary" : "text-gray-400"}`}>
                      {counts[item.value]}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center gap-2">
            <ActivityIndicator color="white" size={30} />
            <Text className="text-gray-300">{t("resourcesList.loading")}</Text>
          </View>
        ) : (
          <FlatList
            data={visible}
            keyExtractor={item => `${item.type}-${item.id}`}
            renderItem={({ item }) => (
              <ResourceCard resource={item} onPress={handleOpen} onPressAuthor={handleOpenAuthor} />
            )}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 12, paddingBottom: bottom + 20 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="white" />}
            ListEmptyComponent={(
              <View className="items-center justify-center px-8 py-20 gap-3">
                <Text className="text-gray-300 text-center">
                  {isError ? t("resourcesList.error") : t("resourcesList.empty")}
                </Text>
                {isError && (
                  <Text className="text-white underline" onPress={() => refetch()}>{t("common.tryAgain")}</Text>
                )}
              </View>
            )}
          />
        )}
      </View>
    </Screen>
  );
}
