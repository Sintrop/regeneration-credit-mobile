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
    <View className="">
      <Text className="text-gray-300 text-xs">
        {t("common.inspector")}
      </Text>

      <User 
        address={address} 
        isLoading={isLoading} 
        name={inspector?.name} 
        photo={inspector?.proofPhoto}
        size={30}
      />
    </View>
  )
}
