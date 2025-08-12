import { View } from "react-native";
import { Text } from "@components";
import { useGetInspection, useGetUser, useUserBasicData } from "@domain";

import { BaseComponentsProps } from "../../FeedItem";
import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { RequestedInspection } from "./RequestedInspection";

export function Inspection({ id }: BaseComponentsProps) {
  const { inspection, isLoading: isLoadingInspection } = useGetInspection({ inspectionId: id });
  const { userType, isLoading: isLoadingUserType } = useGetUser({ address: inspection?.regenerator });
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: inspection?.regenerator, userType })

  if (isLoadingInspection) {
    return <LoadingFeedItem />
  }

  return (
    <View>
      <HeaderItem 
        name={user?.name}
        address={inspection?.regenerator}
        createdAt={inspection?.createdAt}
        isLoading={isLoadingUser || isLoadingUserType}
      />
      
      <View className="mt-5">
        {inspection?.status === "open" && <RequestedInspection />}
      </View>
    </View>
  );
}
