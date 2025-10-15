import { View } from "react-native";

import { useGetResearch, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useTranslation } from "react-i18next";
import { FooterItem } from "../FooterItem/FooterItem";

export function Research({ id }: BaseComponentsProps) {
  const { t } = useTranslation();
  const { research, isLoading: isLoadingResearch } = useGetResearch({ researchId: id });
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: research?.researcher, userType: 3 });

  if (isLoadingResearch) return <LoadingFeedItem />

  return (
    <View>
      <HeaderItem
        name={user?.name}
        address={research?.researcher}
        createdAt={research?.createdAt}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <View className="my-3 relative">
        <Text className="font-bold text-white mb-2">{t("common.research")} #{id}</Text>
        <Text className="text-gray-300 text-sm">
          {t("common.title")}
        </Text>
        <Text className="text-white">
          {research?.title}
        </Text>

        <Text className="text-gray-300 text-sm mt-3">
          {t("common.thesis")}
        </Text>
        <Text className="text-white">
          {research?.thesis}
        </Text>

        <View className="absolute top-0 right-0">
          <Text className="text-white">Valid: {research?.valid}</Text>
        </View>
      </View>
      
      <FooterItem resourceType="research" id={id} />
    </View>
  )
}
