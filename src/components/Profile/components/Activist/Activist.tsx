import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useActivist } from "@domain";
import { DataItem } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { Invitation } from "../Invitation/Invitation";
import { UserDelations } from "../UserDelations/UserDelations";

interface Props {
  address: string
}
export function Activist({ address }: Props) {
  const { t } = useTranslation();
  const { activist, isLoading, isError } = useActivist({ address })

  if (isLoading) return <View/>

  if (!activist || isError) return <View />

  return (
    <View className="gap-3">
      <HeaderProfile
        address={address}
        name={activist?.name}
        photoHash={activist?.proofPhoto}
        userType={6}
      />

      <View className="gap-3 px-2">
        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={activist.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={activist.proofPhoto} />
          <DataItem title={t("profile.level")} value={activist.pool.level} />
          <DataItem title={t("profile.registeredAt")} value={activist.createdAt} />
        </View>

        <Invitation address={address} />
        <UserDelations address={address} />
      </View>
    </View>
  )
}