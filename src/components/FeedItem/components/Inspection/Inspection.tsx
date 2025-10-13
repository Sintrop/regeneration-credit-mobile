import { View } from "react-native";
import { useGetInspection, useGetUser, useUserBasicData } from "@domain";
import { Text } from "@components";

import { BaseComponentsProps } from "../../FeedItem";
import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { RequestedInspection } from "./RequestedInspection";
import { AcceptedInspection } from "./AcceptedInspection";
import { RealizedInspection } from "./RealizedInspection";
import { useTranslation } from "react-i18next";
import { FooterItem } from "../FooterItem/FooterItem";

export function Inspection({ id }: BaseComponentsProps) {
  const { t } = useTranslation();
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
        photo={user?.photo}
      />
      
      <View className="my-3">
        <Text className="font-bold text-white mb-2">{t("common.inspection")} #{id}</Text>
        {inspection?.status === "open" && <RequestedInspection />}
        {inspection?.status === "accepted" && (
          <AcceptedInspection inspectorAddress={inspection.inspector} />
        )}
        {inspection?.status === "realized" && (
          <RealizedInspection 
            inspectorAddress={inspection.inspector}
            score={inspection.regenerationScore}
            treesResult={inspection.treesResult}
            biodiversityResult={inspection.biodiversityResult}  
          />
        )}
      </View>

      <FooterItem resourceType="inspection" id={id} />
    </View>
  );
}
