import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { InspectionStatus, Text } from "@components";
import { InspectionProps, useBlockNumber, useUserBasicData, useUserInspections } from "@domain";
import { useBlocksDuration } from "@hooks";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "UserDetailsScreen">;

const HAS_INSPECTOR = (address: string) => /^0x[0-9a-fA-F]{40}$/.test(address) && !/^0x0{40}$/.test(address);

function InspectorName({ address }: { address: string }) {
  const { user } = useUserBasicData({ address, userType: 2 });
  return <Text className="text-gray-300 text-xs" numberOfLines={1}>{user?.name || `${address.slice(0, 6)}...${address.slice(-4)}`}</Text>;
}

function InspectionRow({ inspection, maxTrees, isLast }: { inspection: InspectionProps; maxTrees: number; isLast: boolean }) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { blockNumber } = useBlockNumber();
  const formatBlocks = useBlocksDuration();
  const done = inspection.status === "realized";
  const at = done ? inspection.inspectedAt : inspection.createdAt;
  const when = blockNumber > at ? t("supporterProfile.ago", { duration: formatBlocks(blockNumber - at).split(" (")[0] }) : "";
  const format = (value: number) => Intl.NumberFormat(i18n.language).format(value);

  return (
    <TouchableOpacity
      className="flex-row gap-3"
      onPress={() => navigation.push("ResourceScreen", { id: inspection.id, resourceType: "inspection" })}
      activeOpacity={0.7}
    >
      <View className="items-center w-4">
        <View className={`w-3 h-3 rounded-full mt-1 ${done ? "bg-green-primary" : "bg-gray-500"}`} />
        {!isLast && <View className="w-[2px] flex-1 bg-card-secondary" />}
      </View>

      <View className="flex-1 pb-5 gap-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white font-semibold">{t("profile.inspection")} #{inspection.id}</Text>
            <Text className="text-gray-400 text-xs">{when}</Text>
          </View>
          <InspectionStatus status={inspection.status} />
        </View>

        {HAS_INSPECTOR(inspection.inspector) && (
          <View className="flex-row items-center gap-1">
            <Text className="text-gray-500 text-xs">{t("common.inspector")}:</Text>
            <InspectorName address={inspection.inspector} />
          </View>
        )}

        {done && (
          <>
            <View className="flex-row gap-4">
              <Metric label={t("common.trees")} value={format(inspection.treesResult)} />
              <Metric label={t("common.biodiversity")} value={format(inspection.biodiversityResult)} />
              <Metric label={t("feed.rScore")} value={format(inspection.regenerationScore)} />
            </View>
            <View className="h-1.5 rounded-full bg-card-secondary overflow-hidden">
              <View className="h-1.5 rounded-full bg-green-primary" style={{ width: `${maxTrees > 0 ? (inspection.treesResult / maxTrees) * 100 : 0}%` }} />
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-white font-bold">{value}</Text>
      <Text className="text-gray-400 text-[11px]">{label}</Text>
    </View>
  );
}

/** Regenerator inspections as a timeline, newest first, with trees relative to the best inspection. */
export function UserInspections({ address }: { address: string }) {
  const { t } = useTranslation();
  const { inspections, isLoading } = useUserInspections({ address });
  const list = [...(inspections ?? [])].sort((a, b) => b.id - a.id);
  const maxTrees = Math.max(0, ...list.filter(item => item.status === "realized").map(item => item.treesResult));

  return (
    <View className="gap-4 p-5 rounded-2xl bg-card-primary">
      <View className="flex-row items-center justify-between">
        <Text className="font-bold text-white text-xl">{t("profile.inspections")}</Text>
        {!isLoading && <Text className="text-gray-400">{list.length}</Text>}
      </View>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : list.length === 0 ? (
        <Text className="text-gray-400">{t("profile.noUserInspections")}</Text>
      ) : (
        <View>
          {list.map((item, index) => (
            <InspectionRow key={item.id} inspection={item} maxTrees={maxTrees} isLast={index === list.length - 1} />
          ))}
        </View>
      )}
    </View>
  );
}
