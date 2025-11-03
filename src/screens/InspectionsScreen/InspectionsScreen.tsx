import { FlatList, ListRenderItemInfo, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@components";
import { useInspectionsList } from "@domain";

import { InspectionItem } from "./components/InspectionItem";
import { InspectionLoading } from "./components/InspectionLoading";

export function InspectionsScreen() {
  const { t } = useTranslation();
  const { list, nextPage, totalPages, currentPage, isLoading, refetch } = useInspectionsList();

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
        <View className="px-3 pt-3">
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
      <FlatList
        data={list}
        keyExtractor={item => item.toString()}
        renderItem={renderInspectionItem}
        contentContainerClassName="px-3 pt-3"
        ListFooterComponent={<View className="mb-20" />}
        onEndReachedThreshold={0.5}
        onEndReached={handleNextPage}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </Screen>
  )
}
