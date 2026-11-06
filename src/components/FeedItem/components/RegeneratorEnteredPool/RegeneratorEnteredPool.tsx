import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { RegeneratorEnteredPoolEvent } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useFeedUser } from "../useFeedUser";
import { FeedBadge } from "../FeedBadge";

export function RegeneratorEnteredPool({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const event = additionalData ? JSON.parse(additionalData) as RegeneratorEnteredPoolEvent : null;
  const user = useFeedUser(event?.address);

  if (!event) return null;

  return (
    <View className="gap-3">
      <HeaderItem
        name={user.name}
        address={event.address}
        createdAt={event.blockNumber}
        photo={user.photo}
        isLoading={user.isLoading}
      />

      <FeedBadge label={t("feedNews.poolBadge")} tone="green" />
      <Text className="text-white text-base font-bold leading-6">{t("feed.enteredPoolTitle")}</Text>
      <Text className="text-gray-300">{t("feed.enteredPoolDescription")}</Text>
    </View>
  );
}
