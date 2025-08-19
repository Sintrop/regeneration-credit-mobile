import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useGetResearcher } from "@domain";
import { DataItem } from "@components";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";

interface Props {
  address: string
}
export function Researcher({ address }: Props) {
  const { t } = useTranslation();
  const { researcher, isLoading, isError } = useGetResearcher({ address })

  if (isLoading) return <View/>

  if (!researcher || isError) return <View />

  return (
    <View className="gap-5">
      <HeaderProfile
        address={address}
        name={researcher?.name}
        photoHash={researcher?.proofPhoto}
        userType={3}
      />

      <View className="gap-5 px-2">
        <View className="gap-1 p-3 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={researcher.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={researcher.proofPhoto} />
          <DataItem title={t("profile.level")} value={researcher.pool.level} />
          <DataItem title={t("profile.canPublishMethod")} value={researcher.canPublishMethod.toString()} />
          <DataItem title={t("profile.lastPublishedAt")} value={researcher.lastPublishedAt} />
          <DataItem title={t("profile.lastCalculatorItemAt")} value={researcher.lastCalculatorItemAt} />
          <DataItem title={t("profile.publishedResearches")} value={researcher.publishedResearches} />
          <DataItem title={t("profile.registeredAt")} value={researcher.createdAt} />
        </View>
      </View>
    </View>
  )
}