import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetContributor } from "@domain";
import { DataItem } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { Invitation } from "../Invitation/Invitation";
import { UserDelations } from "../UserDelations/UserDelations";

interface Props {
  address: string
}
export function Contributor({ address }: Props) {
  const { t } = useTranslation();
  const { contributor, isLoading, isError } = useGetContributor({ address })

  if (isLoading) return <View/>

  if (!contributor || isError) return <View />

  return (
    <View className="gap-3">
      <HeaderProfile
        address={address}
        name={contributor?.name}
        photoHash={contributor?.proofPhoto}
        userType={5}
      />

      <View className="gap-3 px-2">
        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={contributor.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={contributor.proofPhoto} />
          <DataItem title={t("profile.level")} value={contributor.pool.level} />
          <DataItem title={t("profile.lastPublishedAt")} value={contributor.lastPublishedAt} />
          <DataItem title={t("profile.registeredAt")} value={contributor.createdAt} />
        </View>

        <Invitation address={address} />
        <UserDelations address={address} />
      </View>
    </View>
  )
}