import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useCoordinates } from "@domain";

interface Props {
  address: string;
}
export function RegenerationArea({ address }: Props) {
  const { t } = useTranslation();
  const { coordinates } = useCoordinates({ address });

  return (
    <View className="gap-1 p-5 rounded-2xl bg-card-primary">
      <Text className="font-bold text-white text-xl">
        {t("profile.regenerationArea")}
      </Text>
      <Text className="text-gray-300 text-sm">
        {t("profile.coordinates")}
      </Text>

      {coordinates?.map((item, index) => (
        <Text key={index} className="text-white">
          Lat: {item.latitude}, Lng: {item.longitude}
        </Text>
      ))}
    </View>
  );
}