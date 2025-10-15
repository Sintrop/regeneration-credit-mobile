import { View } from "react-native";

import { DataItem, Text } from "@components";
import { useTranslation } from "react-i18next";
import { useInvitation } from "@domain";

interface Props {
  address: string;
}

export function Invitation({ address }: Props) {
  const { t } = useTranslation();
  const { invitation } = useInvitation({ address })

  return (
    <View className="gap-1 p-5 rounded-2xl bg-card-primary">
      <Text className="font-bold text-white text-xl">
        {t("profile.invitation")}
      </Text>

      <View className="mt-2 gap-1">
        <DataItem title={t("profile.inviter")} value={invitation?.inviter} />
        <DataItem title={t("profile.invitedAt")} value={invitation?.createdAt} />
      </View>
    </View>
  );
}
