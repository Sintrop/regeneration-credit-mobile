import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetDeveloper } from "@domain";
import { DataItem } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { Invitation } from "../Invitation/Invitation";

interface Props {
  address: string
}
export function Developer({ address }: Props) {
  const { t } = useTranslation();
  const { developer, isLoading, isError } = useGetDeveloper({ address })

  if (isLoading) return <View/>

  if (!developer || isError) return <View />

  return (
    <View className="gap-3">
      <HeaderProfile
        address={address}
        name={developer?.name}
        photoHash={developer?.proofPhoto}
        userType={4}
      />

      <View className="gap-3 px-2">
        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={developer.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={developer.proofPhoto} />
          <DataItem title={t("profile.level")} value={developer.pool.level} />
          <DataItem title={t("profile.lastPublishedAt")} value={developer.lastPublishedAt} />
          <DataItem title={t("profile.totalReports")} value={developer.totalReports} />
          <DataItem title={t("profile.registeredAt")} value={developer.createdAt} />
        </View>

        <Invitation address={address} />
      </View>
    </View>
  )
}