import { Image, TouchableOpacity, View } from "react-native";
import Config from "react-native-config";

import { useCoordinates } from "@domain";
import { staticAreaMapUrl } from "@utils";

/** Static satellite thumbnail of a regenerator's area; tap opens the full map on the profile. */
export function AreaThumbnail({ address, onPress }: { address?: string; onPress: () => void }) {
  const { coordinates } = useCoordinates({ address });
  const uri = staticAreaMapUrl(coordinates ?? [], { token: Config.MAPBOX_ACCESS_TOKEN });

  if (!uri) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View className="w-full rounded-xl overflow-hidden bg-card-secondary" style={{ aspectRatio: 2 }}>
        <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
}
