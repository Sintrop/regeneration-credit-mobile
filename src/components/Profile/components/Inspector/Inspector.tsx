import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetInspector } from "@domain";
import { DataItem } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { Invitation } from "../Invitation/Invitation";
import { UserDelations } from "../UserDelations/UserDelations";

interface Props {
  address: string
}
export function Inspector({ address }: Props) {
  const { t } = useTranslation();
  const { inspector, isLoading, isError } = useGetInspector({ address })

  if (isLoading) return <View/>

  if (!inspector || isError) return <View />

  return (
    <View className="gap-3">
      <HeaderProfile
        address={address}
        name={inspector?.name}
        photoHash={inspector?.proofPhoto}
        userType={2}
      />

      <View className="gap-3 px-2">
        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={inspector.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={inspector.proofPhoto} />
          <DataItem title={t("profile.level")} value={inspector.pool.level} />
          <DataItem title={t("profile.lastAcceptedAt")} value={inspector.lastAcceptedAt} />
          <DataItem title={t("profile.lastRealizedAt")} value={inspector.lastRealizedAt} />
          <DataItem title={t("profile.lastInspection")} value={inspector.lastInspection} />
          <DataItem title={t("profile.giveUps")} value={inspector.giveUps} />
          <DataItem title={t("profile.registeredAt")} value={inspector.createdAt} />
        </View>

        <Invitation address={address} />
        <UserDelations address={address} />
      </View>
    </View>
  )
}