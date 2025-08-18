import { View } from "react-native";

import { Text, User } from "@components";
import { useTranslation } from "react-i18next";
import { useGetDeveloper } from "@domain";

interface Props {
  address: string;
}
export function Developer({ address }: Props) {
  const { t } = useTranslation();
  const { developer, isLoading } = useGetDeveloper({ address });

  return (
    <View className="p-3 rounded-2xl bg-card-primary gap-1">
      <Text className="text-gray-300 text-sm">
        {t("common.developer")}
      </Text>

      <User 
        address={address} 
        isLoading={isLoading} 
        name={developer?.name} 
        photo={developer?.proofPhoto}
      />
    </View>
  )
}
