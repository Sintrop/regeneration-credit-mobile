import { View } from "react-native";

import { useGetResearch, useUserBasicData } from "@domain";
import { BaseComponentsProps } from "@components";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { PublicationNews } from "../PublicationNews";

export function Research({ id }: BaseComponentsProps) {
  const { research, isLoading: isLoadingResearch } = useGetResearch({ researchId: id });
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: research?.researcher, userType: 3 });

  if (isLoadingResearch) return <LoadingFeedItem />

  return (
    <View className="gap-3">
      <HeaderItem
        name={user?.name}
        address={research?.researcher}
        createdAt={research?.createdAt}
        photo={user?.photo}
        isLoading={isLoadingUser}
      />

      <PublicationNews type="research" id={id} title={research?.title} body={research?.thesis} />
    </View>
  )
}
