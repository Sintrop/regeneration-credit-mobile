import { View } from "react-native";

import { useGetReport, useUserBasicData } from "@domain";

import { BaseComponentsProps } from "../../FeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { LoadingFeedItem } from "../LoadingFeedItem";

export function Report({ id }: BaseComponentsProps) {
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
    </View>
  )
}