import { View } from "react-native";

import { Text, User } from "@components";
import { useTranslation } from "react-i18next";
import { useGetContributor } from "@domain";

interface Props {
  address: string;
}
export function Contributor({ address }: Props) {
  const { t } = useTranslation();
  const { contributor, isLoading } = useGetContributor({ address });

  return (
    <View className="p-3 rounded-2xl bg-card-primary gap-1">
      <Text className="text-gray-300 text-sm">
        {t("common.contributor")}
      </Text>

      <User 
        address={address} 
        isLoading={isLoading} 
        name={contributor?.name} 
        photo={contributor?.proofPhoto}
      />
    </View>
  )
}
