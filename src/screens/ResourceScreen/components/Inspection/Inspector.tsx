import { View } from "react-native";

import { Text, User } from "@components";
import { useTranslation } from "react-i18next";
import { useGetInspector } from "@domain";

interface Props {
  address: string;
}
export function Inspector({ address }: Props) {
  const { t } = useTranslation();
  const { inspector, isLoading } = useGetInspector({ address });

  return (
    <View className="p-3 rounded-2xl bg-card-primary gap-1">
      <Text className="text-gray-300 text-sm">
        {t("common.inspector")}
      </Text>

      <User 
        address={address} 
        isLoading={isLoading} 
        name={inspector?.name} 
        photo={inspector?.proofPhoto}
      />
    </View>
  )
}
