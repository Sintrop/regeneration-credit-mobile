import { View } from "react-native";

import { Text, User } from "@components";
import { useTranslation } from "react-i18next";
import { useGetRegenerator } from "@domain";

interface Props {
  address: string;
}
export function Regenerator({ address }: Props) {
  const { t } = useTranslation();
  const { regenerator, isLoading } = useGetRegenerator({ address });

  return (
    <View className="p-3 rounded-2xl bg-card-primary gap-1">
      <Text className="text-gray-300 text-sm">
        {t("common.regenerator")}
      </Text>

      <User 
        address={address} 
        isLoading={isLoading} 
        name={regenerator?.name} 
        photo={regenerator?.proofPhoto}
      />
    </View>
  )
}
