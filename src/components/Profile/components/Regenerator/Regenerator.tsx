import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetRegenerator, useProjectDescription, useUserInspections } from "@domain";
import { Certificate, DataItem, Text, InvalidationCard } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { AboutSection } from "../AboutSection/AboutSection";
import { RegenerationArea } from "./RegenerationArea";
import { Invitation } from "../Invitation/Invitation";
import { UserDelations } from "../UserDelations/UserDelations";
import { UserInspections } from "../UserInspections/UserInspections";
import { RegeneratorSummary } from "./RegeneratorSummary";

interface Props {
  address: string
  changeScrollEnabled: (enable: boolean) => void;
}
export function Regenerator({ address, changeScrollEnabled }: Props) {
  const { t } = useTranslation();
  const { regenerator, isLoading: isLoadingRegenerator, isError } = useGetRegenerator({ address })
  const { projectDescription, isLoading: isLoadingDescription } = useProjectDescription({ address });
  const { inspections } = useUserInspections({ address });
  const lastRealized = [...(inspections ?? [])].filter(item => item.status === "realized").sort((a, b) => b.id - a.id)[0];
  
  if (isLoadingRegenerator) return <View/>

  if (!regenerator || isError) return <View />

  return (
    <View className="gap-3 mb-5">
      <HeaderProfile
        address={address}
        name={regenerator?.name}
        photoHash={regenerator?.proofPhoto}
        userType={1}
      />

      <View className="gap-3 px-2">
        <InvalidationCard target="user" idOrAddress={address} />

        <RegeneratorSummary
          totalInspections={regenerator.totalInspections}
          score={regenerator.regenerationScore.score}
          totalArea={regenerator.totalArea}
          lastTrees={lastRealized?.treesResult}
          pendingInspection={regenerator.pendingInspection}
        />

        <AboutSection text={projectDescription} isLoading={isLoadingDescription} />

        <UserInspections address={address} />

        <RegenerationArea
          address={address}
          totalArea={regenerator.totalArea}
          changeScrollEnabled={changeScrollEnabled}
        />

        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <Text className="font-bold text-white text-xl">
            {t("profile.certificates")}
          </Text>
          <Certificate address={address} type="regenerator" />
        </View>
        <Invitation address={address} />
        <UserDelations address={address} />

        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <Text className="text-gray-300 text-sm mb-1">{t("regeneratorProfile.technicalData")}</Text>
          <DataItem title="ID" value={regenerator.id} />
          <DataItem title={t("profile.lastRequestAt")} value={regenerator.lastRequestAt} />
          <DataItem title={t("profile.coordinatesCount")} value={regenerator.coordinatesCount} />
          <DataItem title={t("profile.registeredAt")} value={regenerator.createdAt} />
          <DataItem title={t("profile.hashProofPhoto")} value={regenerator.proofPhoto} />
        </View>
      </View>
    </View>
  )
}