import { View } from "react-native";

import { useGetReport, useUserBasicData } from "@domain";
import { Text } from "@components";

import { BaseComponentsProps } from "../../FeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { LoadingFeedItem } from "../LoadingFeedItem";
import { useTranslation } from "react-i18next";
import { FooterItem } from "../FooterItem/FooterItem";

export function Report({ id }: BaseComponentsProps) {
  const { t } = useTranslation();
  const { report, isLoading: isLoadingReport } = useGetReport({ reportId: id });
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: report?.developer, userType: 4 });
  
  if (isLoadingReport) {
    return <LoadingFeedItem />
  }

  return (
    <View>
      <HeaderItem
        address={report?.developer}
        name={user?.name}
        photo={user?.photo}
        createdAt={report?.createdAtBlockNumber}
        isLoading={isLoadingUser}
      />

      <View className="my-3 relative">
        <Text className="font-bold text-white mb-2">{t("common.report")} #{id}</Text>
        <Text className="text-gray-300 text-sm">
          {t("common.description")}
        </Text>
        <Text className="text-white">
          {report?.description}
        </Text>

        <View className="absolute top-0 right-0">
          <Text className="text-white">Valid: {report?.valid.toString()}</Text>
        </View>
      </View>

      <FooterItem resourceType="report" id={id} />
    </View>
  )
}