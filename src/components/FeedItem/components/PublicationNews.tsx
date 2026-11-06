import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text } from "@components";
import { AppStackParamsList } from "@routes";
import { ResourcesTypes } from "@screens";
import { cleanResourceText, resourceHeading } from "@utils";

import { FeedBadge, FeedTone } from "./FeedBadge";
import { FeedLink } from "./FeedLink";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

const CONFIG: Record<"research" | "report" | "contribution", { badge: string; tone: FeedTone }> = {
  research: { badge: "feedNews.researchBadge", tone: "green" },
  report: { badge: "feedNews.reportBadge", tone: "amber" },
  contribution: { badge: "feedNews.contributionBadge", tone: "blue" },
};

interface Props {
  type: "research" | "report" | "contribution";
  id: number;
  title?: string;
  body?: string;
}

/** Research, development report or contribution as a short news item. */
export function PublicationNews({ type, id, title, body }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const heading = resourceHeading(title, body);
  const summary = title ? cleanResourceText(body) : "";

  return (
    <View className="gap-3">
      <FeedBadge label={t(CONFIG[type].badge, { id })} tone={CONFIG[type].tone} />
      <Text className="text-white text-base font-bold leading-6" numberOfLines={3}>{heading}</Text>
      {!!summary && <Text className="text-gray-300 leading-5" numberOfLines={4}>{summary}</Text>}
      <FeedLink label={t("feedNews.read")} onPress={() => navigation.navigate("ResourceScreen", { id, resourceType: type as ResourcesTypes })} />
    </View>
  );
}
