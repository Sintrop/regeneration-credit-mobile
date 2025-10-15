import { View } from "react-native";

import { useGetContribution, useUserBasicData } from "@domain";
import { Text } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useTranslation } from "react-i18next";
import { FooterItem } from "../FooterItem/FooterItem";

interface Props {
  id: number
}
export function Contribution({ id }: Props) {
  const { t } = useTranslation();
  const { contribution, isLoading: isLoadingContribution } = useGetContribution({ contributionId: id });
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: contribution?.contributor, userType: 5 });
  
  if (isLoadingContribution) return <LoadingFeedItem />

  return (
    <View>
      <HeaderItem
        name={user?.name}
        address={contribution?.contributor}
        createdAt={contribution?.createdAt}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <View className="my-3 relative">
        <Text className="font-bold text-white mb-2">{t("common.contribution")} #{id}</Text>
        <Text className="text-gray-300 text-sm">
          {t("common.description")}
        </Text>
        <Text className="text-white">
          {contribution?.description}
        </Text>

        <View className="absolute top-0 right-0">
          <Text className="text-white">Valid: {contribution?.valid.toString()}</Text>
        </View>
      </View>
      
      <FooterItem resourceType="contribution" id={id} />
    </View>
  )
}
