import { Image, View } from "react-native";
import Jazzicon from "react-native-jazzicon";

import { useSettingsContext } from "@hooks";

interface Props {
  address: string;
  photoHash?: string;
  size?: number;
  withBorder?: boolean;
}
export function Avatar({ address, photoHash, size = 20, withBorder }: Props) {
  const { ipfsGateway } = useSettingsContext();

  return (
    <View className={`w-[${size}] h-[${size}] rounded-full relative overflow-hidden ${withBorder && "border-4 border-white"}`}>
      <Jazzicon address={address} size={size} />
      {photoHash && (
        <Image 
          source={{ uri: `${ipfsGateway}/ipfs/${photoHash}` }}
          className="w-full h-full rounded-full absolute z-10"
          resizeMode="cover"
        />
      )}
    </View>
  )
}