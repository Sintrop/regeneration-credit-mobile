import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetRegenerator, useProjectDescription } from "@domain";
import { DataItem } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { AboutSection } from "../AboutSection/AboutSection";
import { RegenerationArea } from "./RegenerationArea";
import { Invitation } from "../Invitation/Invitation";
import { UserDelations } from "../UserDelations/UserDelations";

interface Props {
  address: string
}
export function Regenerator({ address }: Props) {
  const { t } = useTranslation();
  const { regenerator, isLoading: isLoadingRegenerator, isError } = useGetRegenerator({ address })
  const { projectDescription, isLoading: isLoadingDescription } = useProjectDescription({ address });
  
  if (isLoadingRegenerator) return <View/>

  if (!regenerator || isError) return <View />

  return (
    <View className="gap-3">
      <HeaderProfile
        address={address}
        name={regenerator?.name}
        photoHash={regenerator?.proofPhoto}
        userType={1}
      />

      <View className="gap-3 px-2">
        <AboutSection text={projectDescription} isLoading={isLoadingDescription} />
        
        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={regenerator.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={regenerator.proofPhoto} />
          <DataItem title={t("profile.totalArea")} value={regenerator.totalArea} suffix="m2" />
          <DataItem title={t("profile.regenerationScore")} value={regenerator.regenerationScore.score} />
          <DataItem title={t("profile.totalInspections")} value={regenerator.totalInspections} />
          <DataItem title={t("profile.lastRequestAt")} value={regenerator.lastRequestAt} />
          <DataItem title={t("profile.coordinatesCount")} value={regenerator.coordinatesCount} />
          <DataItem title={t("profile.registeredAt")} value={regenerator.createdAt} />
        </View>

        <RegenerationArea address={address} />
        <Invitation address={address} />
        <UserDelations address={address} />
      </View>
    </View>
  )
}