import { View } from "react-native";
import { useGetRegenerator } from "@domain";
import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { DataItem } from "../DataItem/DataItem";
import { useTranslation } from "react-i18next";

interface Props {
  address: string
}
export function Regenerator({ address }: Props) {
  const { t } = useTranslation();
  const { regenerator, isLoading, isError } = useGetRegenerator({ address })

  if (isLoading) return <View/>

  if (!regenerator || isError) return <View />

  return (
    <View className="gap-5">
      <HeaderProfile
        address={address}
        name={regenerator?.name}
        photoHash={regenerator?.proofPhoto}
        userType={1}
      />

      <View className="gap-5 px-2">
        <View className="gap-1 p-3 rounded-2xl bg-card-primary">
          <DataItem title="ID" value={regenerator.id} />
          <DataItem title={t("profile.hashProofPhoto")} value={regenerator.proofPhoto} />
          <DataItem title={t("profile.totalArea")} value={regenerator.totalArea} suffix="m2" />
          <DataItem title={t("profile.regenerationScore")} value={regenerator.regenerationScore.score} />
          <DataItem title={t("profile.totalInspections")} value={regenerator.totalInspections} />
          <DataItem title={t("profile.lastRequestAt")} value={regenerator.lastRequestAt} />
          <DataItem title={t("profile.coordinatesCount")} value={regenerator.coordinatesCount} />
          <DataItem title={t("profile.registeredAt")} value={regenerator.createdAt} />
        </View>
      </View>
    </View>
  )
}