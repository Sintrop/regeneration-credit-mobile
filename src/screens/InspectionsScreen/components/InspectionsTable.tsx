import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text } from "@components";
import { InspectionProps, InspectionStatus, useAllInspections, useUserBasicData } from "@domain";
import { useAppSafeArea } from "@hooks";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "InspectionsScreen">;
type Filter = "all" | InspectionStatus;

const FILTERS: Filter[] = ["all", "realized", "open", "accepted", "expired", "invalidated"];

const STATUS_COLOR: Record<InspectionStatus, string> = {
  open: "text-yellow-400",
  accepted: "text-blue-400",
  realized: "text-green-primary",
  expired: "text-orange-400",
  invalidated: "text-red-400",
};

const COLUMNS = [
  { key: "id", width: 52 },
  { key: "status", width: 96 },
  { key: "regenerator", width: 150 },
  { key: "inspector", width: 130 },
  { key: "trees", width: 72 },
  { key: "biodiversity", width: 72 },
  { key: "score", width: 64 },
  { key: "era", width: 52 },
  { key: "inspectedAt", width: 92 },
] as const;

const TABLE_WIDTH = COLUMNS.reduce((sum, column) => sum + column.width, 0);

function UserName({ address, userType }: { address: string; userType: number }) {
  const { user } = useUserBasicData({ address, userType });
  return (
    <Text className="text-white text-xs" numberOfLines={1}>
      {user?.name || `${address.slice(0, 6)}...${address.slice(-4)}`}
    </Text>
  );
}

function Row({ inspection, onPress }: { inspection: InspectionProps; onPress: () => void }) {
  const { t, i18n } = useTranslation();
  const format = (value: number) => Intl.NumberFormat(i18n.language).format(value);
  const done = inspection.status === "realized";
  const hasInspector = /^0x[0-9a-fA-F]{40}$/.test(inspection.inspector) && !/^0x0{40}$/.test(inspection.inspector);

  const cells: Record<typeof COLUMNS[number]["key"], React.ReactNode> = {
    id: <Text className="text-gray-300 text-xs">#{inspection.id}</Text>,
    status: <Text className={`text-xs font-semibold ${STATUS_COLOR[inspection.status]}`}>{t(`inspectionStatus.${inspection.status}`)}</Text>,
    regenerator: <UserName address={inspection.regenerator} userType={1} />,
    inspector: hasInspector ? <UserName address={inspection.inspector} userType={2} /> : <Text className="text-gray-500 text-xs">-</Text>,
    trees: <Text className="text-white text-xs text-right">{done ? format(inspection.treesResult) : "-"}</Text>,
    biodiversity: <Text className="text-white text-xs text-right">{done ? format(inspection.biodiversityResult) : "-"}</Text>,
    score: <Text className="text-white text-xs text-right font-semibold">{done ? inspection.regenerationScore : "-"}</Text>,
    era: <Text className="text-gray-300 text-xs text-right">{done ? inspection.inspectedAtEra : "-"}</Text>,
    inspectedAt: <Text className="text-gray-400 text-xs text-right">{done ? inspection.inspectedAt : "-"}</Text>,
  };

  return (
    <TouchableOpacity className="flex-row items-center h-11 border-b border-card-secondary" onPress={onPress}>
      {COLUMNS.map(column => (
        <View key={column.key} style={{ width: column.width }} className="px-2">
          {cells[column.key]}
        </View>
      ))}
    </TouchableOpacity>
  );
}

/** All inspections at once in a dense, horizontally scrollable table. */
export function InspectionsTable() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { bottom } = useAppSafeArea();
  const { inspections, isLoading, refetch, isRefetching } = useAllInspections();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: inspections.length };
    inspections.forEach(item => { result[item.status] = (result[item.status] ?? 0) + 1; });
    return result;
  }, [inspections]);

  const visible = filter === "all" ? inspections : inspections.filter(item => item.status === filter);

  const realized = inspections.filter(item => item.status === "realized");
  const totalTrees = realized.reduce((sum, item) => sum + item.treesResult, 0);
  const avgScore = realized.length ? realized.reduce((sum, item) => sum + item.regenerationScore, 0) / realized.length : 0;
  const format = (value: number, digits = 0) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-2">
        <ActivityIndicator color="white" size={30} />
        <Text className="text-gray-300">{t("inspections.loadingAll")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row gap-2 px-3 pb-3">
        <Summary label={t("inspections.realizedCount")} value={format(realized.length)} />
        <Summary label={t("inspections.treesCounted")} value={format(totalTrees)} />
        <Summary label={t("inspections.avgScore")} value={format(avgScore, 1)} />
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingBottom: 12 }}>
          {FILTERS.filter(item => item === "all" || counts[item]).map(item => {
            const selected = item === filter;
            return (
              <TouchableOpacity
                key={item}
                className={`h-8 px-3 rounded-full flex-row items-center gap-2 ${selected ? "bg-green-primary" : "bg-card-primary"}`}
                onPress={() => setFilter(item)}
              >
                <Text className={`text-xs font-semibold ${selected ? "text-green-secondary" : "text-white"}`}>
                  {item === "all" ? t("resourcesList.filterAll") : t(`inspectionStatus.${item}`)}
                </Text>
                <Text className={`text-xs ${selected ? "text-green-secondary" : "text-gray-400"}`}>{counts[item] ?? 0}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator bounces={false}>
        <View style={{ width: TABLE_WIDTH + 24 }} className="px-3 flex-1">
          <View className="flex-row items-center h-9 rounded-t-xl bg-card-primary">
            {COLUMNS.map(column => (
              <View key={column.key} style={{ width: column.width }} className="px-2">
                <Text className={`text-gray-400 text-[11px] font-semibold ${["trees", "biodiversity", "score", "era", "inspectedAt"].includes(column.key) ? "text-right" : ""}`}>
                  {t(`inspections.columns.${column.key}`)}
                </Text>
              </View>
            ))}
          </View>
          <FlatList
            data={visible}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Row inspection={item} onPress={() => navigation.navigate("ResourceScreen", { id: item.id, resourceType: "inspection" })} />
            )}
            initialNumToRender={20}
            contentContainerStyle={{ paddingBottom: bottom + 40 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="white" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 p-3 rounded-xl bg-card-primary">
      <Text className="text-white font-bold">{value}</Text>
      <Text className="text-gray-400 text-[11px]">{label}</Text>
    </View>
  );
}
