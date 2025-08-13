import { Image, View } from "react-native";
import Jazzicon from "react-native-jazzicon";

import { useSettingsContext } from "@hooks";

interface Props {
  address: string;
  photoHash?: string;
  size?: number
}
export function Avatar({ address, photoHash, size = 20 }: Props) {
  const { ipfsGateway } = useSettingsContext();

  return (
    <View className={`w-[${size}] h-[${size}] rounded-full overflow-hidden relative`}>
      <Jazzicon address={address} size={size} />
      {photoHash && (
        <Image 
          source={{ uri: `${ipfsGateway}/ipfs/${photoHash}` }}
          className="w-full h-full rounded-full absolute z-10 top-0 left-0"
          resizeMode="cover"
        />
      )}
    </View>
  )
}