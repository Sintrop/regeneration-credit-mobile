import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { RegeneratorEnteredPoolEvent } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useFeedUser } from "../useFeedUser";

export function RegeneratorEnteredPool({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const event = additionalData ? JSON.parse(additionalData) as RegeneratorEnteredPoolEvent : null;
  const user = useFeedUser(event?.address);

  if (!event) return null;

  return (
    <View>
      <HeaderItem
        name={user.name}
        address={event.address}
        createdAt={event.blockNumber}
        photo={user.photo}
        isLoading={user.isLoading}
      />

      <View className="my-3 gap-2 p-3 rounded-xl bg-green-primary/10 border border-green-primary/30">
        <Text className="font-bold text-green-primary">{t("feed.enteredPoolTitle")}</Text>
        <Text className="text-white">{t("feed.enteredPoolDescription")}</Text>
      </View>
    </View>
  );
}
