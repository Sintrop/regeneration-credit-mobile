import { View } from "react-native";

import { useGetContribution, useUserBasicData } from "@domain";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { PublicationNews } from "../PublicationNews";

interface Props {
  id: number
}
export function Contribution({ id }: Props) {
  const { contribution, isLoading: isLoadingContribution } = useGetContribution({ contributionId: id });
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: contribution?.contributor, userType: 5 });
  
  if (isLoadingContribution) return <LoadingFeedItem />

  return (
    <View className="gap-3">
      <HeaderItem
        name={user?.name}
        address={contribution?.contributor}
        createdAt={contribution?.createdAt}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <PublicationNews type="contribution" id={id} body={contribution?.description} />
    </View>
  )
}
