import { useState } from "react";
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen, Text } from "@components";
import { useInspectionsList } from "@domain";

import { InspectionItem } from "./components/InspectionItem";
import { InspectionLoading } from "./components/InspectionLoading";
import { InspectionsTable } from "./components/InspectionsTable";

type ViewMode = "cards" | "table";

export function InspectionsScreen() {
  const { t } = useTranslation();
  const { list, nextPage, totalPages, currentPage, isLoading, refetch } = useInspectionsList();
  const [mode, setMode] = useState<ViewMode>("cards");

  const tabs = (
    <View className="flex-row mx-3 mt-3 mb-3 p-1 rounded-xl bg-card-primary">
      {(["cards", "table"] as ViewMode[]).map(item => (
        <TouchableOpacity
          key={item}
          className={`flex-1 h-9 rounded-lg items-center justify-center ${mode === item ? "bg-green-primary" : ""}`}
          onPress={() => setMode(item)}
        >
          <Text className={`font-semibold text-sm ${mode === item ? "text-green-secondary" : "text-white"}`}>{t(`inspections.view.${item}`)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (mode === "table") {
    return (
      <Screen title={t('inspections.title')} showBackButton>
        {tabs}
        <InspectionsTable />
      </Screen>
    );
  }

  function handleNextPage() {
    if (currentPage < totalPages){
      nextPage();
    }
  }

  function renderInspectionItem({ item }: ListRenderItemInfo<number>) {
    return <InspectionItem inspectionId={item} />
  }

  if (isLoading) {
    return (
      <Screen title={t('inspections.title')} showBackButton>
        {tabs}
        <View className="px-3">
          <InspectionLoading />
          <InspectionLoading />
          <InspectionLoading />
          <InspectionLoading />
          <InspectionLoading />
          <InspectionLoading />
        </View>
      </Screen>
    )
  }

  return (
    <Screen title={t('inspections.title')} showBackButton>
      {tabs}
      <FlatList
        data={list}
        keyExtractor={item => item.toString()}
        renderItem={renderInspectionItem}
        contentContainerClassName="px-3"
        ListFooterComponent={<View className="mb-20" />}
        onEndReachedThreshold={0.5}
        onEndReached={handleNextPage}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </Screen>
  )
}
