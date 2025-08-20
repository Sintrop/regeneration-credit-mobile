import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useUserDelations } from "@domain";
import { DelationItem } from "./DelationItem";

interface Props {
  address: string;
}

export function UserDelations({ address }: Props) {
  const { t } = useTranslation();
  const { delations } = useUserDelations({ address })

  return (
    <View className="gap-1 p-5 rounded-2xl bg-card-primary">
      <Text className="font-bold text-white text-xl">
        {t("profile.delations")}
      </Text>

      <View className="mt-2 gap-1">
        {delations?.length === 0 ? (
          <Text className="text-white my-5 text-center">
            {t("profile.noUserDelations")}
          </Text>
        ) : (
          <>
            {delations?.map((item, index) => (
              <DelationItem key={index} delation={item} />
            ))}
          </>
        )}
      </View>
    </View>
  );
}
