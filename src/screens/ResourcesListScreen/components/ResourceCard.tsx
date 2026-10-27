import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text, UserBadge } from "@components";
import { PublishedResource, PublishedResourceType, useVotingContext } from "@domain";
import { cleanResourceText, resourceHeading } from "@utils";

const TYPE_STYLE: Record<PublishedResourceType, { label: string; badge: string }> = {
  research: { label: "resourcesList.research", badge: "bg-green-primary/20 text-green-primary" },
  contribution: { label: "resourcesList.contribution", badge: "bg-blue-primary/20 text-blue-primary" },
  report: { label: "resourcesList.report", badge: "bg-amber-400/20 text-amber-300" },
};

interface Props {
  resource: PublishedResource;
  onPress: (resource: PublishedResource) => void;
  onPressAuthor: (address: string) => void;
}

export function ResourceCard({ resource, onPress, onPressAuthor }: Props) {
  const { t } = useTranslation();
  const style = TYPE_STYLE[resource.type];
  const heading = resourceHeading(resource.title, resource.body);
  const summary = resource.title ? cleanResourceText(resource.body) : "";
  const voting = useVotingContext();
  const votingOpen = !!voting && voting.currentEra[resource.type] === resource.era;

  return (
    <TouchableOpacity
      className="p-4 rounded-2xl bg-card-primary gap-3"
      onPress={() => onPress(resource)}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between">
        <Text className={`text-xs font-semibold px-3 py-1 rounded-full overflow-hidden ${style.badge}`}>
          {t(style.label)} #{resource.id}
        </Text>
        <Text className="text-gray-400 text-xs">{t("resourcesList.era", { era: resource.era })}</Text>
      </View>

      <Text className="text-white text-base font-bold" numberOfLines={3}>{heading}</Text>

      {votingOpen && voting && (
        <Text className="self-start text-xs font-semibold px-3 py-1 rounded-full overflow-hidden bg-red-400/15 text-red-300">
          {t("invalidation.openChip", { votes: resource.validationsCount, needed: voting.votesNeeded })}
        </Text>
      )}

      {!!summary && (
        <Text className="text-gray-300 text-sm" numberOfLines={3}>{summary}</Text>
      )}

      <View className="flex-row items-center justify-between gap-3 pt-3 border-t border-card-secondary">
        <View className="flex-1">
          <UserBadge address={resource.author} label={t("resourcesList.publishedBy")} onPress={onPressAuthor} />
        </View>
        <Text className="text-green-primary text-sm font-semibold">{t("resourcesList.open")} ›</Text>
      </View>
    </TouchableOpacity>
  );
}
