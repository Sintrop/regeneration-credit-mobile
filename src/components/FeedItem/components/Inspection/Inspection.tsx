import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useGetInspection, useUserBasicData } from "@domain";
import { Text } from "@components";
import { AppStackParamsList } from "@routes";

import { BaseComponentsProps } from "../../FeedItem";
import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { FeedBadge, FeedTone } from "../FeedBadge";
import { FeedLink } from "../FeedLink";
import { AreaThumbnail } from "./AreaThumbnail";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;
type Stage = "requested" | "accepted" | "realized";

const STAGE_TONE: Record<Stage, FeedTone> = { requested: "amber", accepted: "blue", realized: "green" };

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1">
      <Text className="text-white text-2xl font-bold">{value}</Text>
      <Text className="text-gray-400 text-xs">{label}</Text>
    </View>
  );
}

export function Inspection({ id, additionalData }: BaseComponentsProps) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { inspection, isLoading } = useGetInspection({ inspectionId: id });
  const { user: regenerator, isLoading: isLoadingRegenerator } = useUserBasicData({ address: inspection?.regenerator, userType: 1 });
  const { user: inspector } = useUserBasicData({ address: inspection?.inspector, userType: 2 });

  if (isLoading || !inspection) return <LoadingFeedItem />;

  const stage: Stage = additionalData === "requested" ? "requested" : additionalData === "accepted" ? "accepted" : "realized";
  const eventBlock = stage === "requested" ? inspection.createdAt : stage === "accepted" ? inspection.acceptedAt : inspection.inspectedAt;
  const regeneratorName = regenerator?.name?.trim() || t("common.regenerator");
  const inspectorName = inspector?.name?.trim() || t("common.inspector");
  const format = (value: number) => Intl.NumberFormat(i18n.language).format(value);

  const headline = {
    requested: t("feedNews.requested", { regenerator: regeneratorName }),
    accepted: t("feedNews.accepted", { inspector: inspectorName, regenerator: regeneratorName }),
    realized: t("feedNews.realized", { inspector: inspectorName, regenerator: regeneratorName }),
  }[stage];

  return (
    <View className="gap-3">
      <HeaderItem
        name={stage === "requested" ? regenerator?.name : inspector?.name}
        address={stage === "requested" ? inspection.regenerator : inspection.inspector}
        createdAt={eventBlock}
        photo={stage === "requested" ? regenerator?.photo : inspector?.photo}
        isLoading={isLoadingRegenerator}
      />

      <FeedBadge label={t(`feedNews.stage.${stage}`, { id })} tone={STAGE_TONE[stage]} />
      <Text className="text-white text-base leading-6">{headline}</Text>

      {stage === "requested" && <Text className="text-gray-400 text-sm">{t("feedNews.waitingInspector")}</Text>}

      {stage === "realized" && (
        <AreaThumbnail
          address={inspection.regenerator}
          onPress={() => navigation.navigate("UserDetailsScreen", { address: inspection.regenerator })}
        />
      )}

      {stage === "realized" && (
        <View className="flex-row p-4 rounded-xl bg-card-secondary">
          <Metric value={format(inspection.treesResult)} label={t("common.trees")} />
          <Metric value={format(inspection.biodiversityResult)} label={t("common.biodiversity")} />
          <Metric value={format(inspection.regenerationScore)} label={t("feed.rScore")} />
        </View>
      )}

      <FeedLink
        label={t("feedNews.seeInspection")}
        onPress={() => navigation.navigate("ResourceScreen", { id, resourceType: "inspection" })}
      />
    </View>
  );
}
