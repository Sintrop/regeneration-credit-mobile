import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Map, Text } from "@components";
import { useCoordinates } from "@domain";

interface Props {
  address: string;
  totalArea: number;
}
export function RegenerationArea({ address, totalArea }: Props) {
  const { t } = useTranslation();
  const { coordinates } = useCoordinates({ address });

  return (
    <View className="gap-1 p-5 rounded-2xl bg-card-primary">
      <Text className="font-bold text-white text-xl">
        {t("profile.regenerationArea")}
      </Text>
      <Map
        coords={coordinates}
        showMarkers
        showPolyline
        mapStyle={{ width: '100%', height: 250 }}
      />
      <Text className="text-gray-300 text-sm mt-2">
        {t("profile.coordinates")}
      </Text>

      {coordinates?.map((item, index) => (
        <Text key={index} className="text-white">
          Lat: {item.latitude}, Lng: {item.longitude}
        </Text>
      ))}

      <Text className="mt-2 text-white">
        {t('profile.totalArea')}: {Intl.NumberFormat('pt-BR').format(totalArea)} m²
      </Text>
    </View>
  );
}