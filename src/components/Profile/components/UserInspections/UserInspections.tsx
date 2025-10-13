import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useUserInspections } from "@domain";
import { InspectionItem } from "./InspectionItem";

interface Props {
  address: string;
}

export function UserInspections({ address }: Props) {
  const { t } = useTranslation();
  const { inspections } = useUserInspections({ address })

  return (
    <View className="gap-1 p-5 rounded-2xl bg-card-primary">
      <Text className="font-bold text-white text-xl">
        {t("profile.inspections")}
      </Text>

      <View className="mt-2 gap-1">
        {inspections?.length === 0 ? (
          <Text className="text-white my-5 text-center">
            {t("profile.noUserInspections")}
          </Text>
        ) : (
          <>
            {inspections?.map((item, index) => (
              <InspectionItem key={index} inspection={item} />
            ))}
          </>
        )}
      </View>
    </View>
  );
}
