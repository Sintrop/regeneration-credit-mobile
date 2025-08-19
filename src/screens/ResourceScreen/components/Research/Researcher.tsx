import { View } from "react-native";

import { Text, User } from "@components";
import { useTranslation } from "react-i18next";
import { useGetResearcher } from "@domain";

interface Props {
  address: string;
}
export function Researcher({ address }: Props) {
  const { t } = useTranslation();
  const { researcher, isLoading } = useGetResearcher({ address });

  return (
    <View className="p-3 rounded-2xl bg-card-primary gap-1">
      <Text className="text-gray-300 text-sm">
        {t("common.researcher")}
      </Text>

      <User 
        address={address} 
        isLoading={isLoading} 
        name={researcher?.name} 
        photo={researcher?.proofPhoto}
      />
    </View>
  )
}
