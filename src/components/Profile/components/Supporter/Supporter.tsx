import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetSupporter } from "@domain";
import { DataItem } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { Invitation } from "../Invitation/Invitation";

interface Props {
  address: string
}
export function Supporter({ address }: Props) {
  const { t } = useTranslation();
  const { supporter, isLoading, isError } = useGetSupporter({ address });

  if (isLoading) return <View/>

  if (!supporter || isError) return <View />

  return (
    <View className="gap-3">
      <HeaderProfile
        address={address}
        name={supporter?.name}
        photoHash={supporter?.profilePhoto}
        userType={7}
      />

      <View className="gap-3 px-2">
        <View className="gap-1 p-5 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={supporter.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={supporter.profilePhoto} />
          <DataItem title={t("profile.registeredAt")} value={supporter.createdAt} />
        </View>

        <Invitation address={address} />
      </View>
    </View>
  )
}