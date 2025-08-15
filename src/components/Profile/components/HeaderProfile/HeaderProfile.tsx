import { Image, View } from "react-native";

import { Text, UserTypeText, UserTypeTextType } from "@components";

//@ts-ignore
import BGFlorest from "../../../../assets/images/bg-florest.jpg";
import Jazzicon from "react-native-jazzicon";
import { useSettingsContext } from "@hooks";

interface Props {
  address: string;
  name: string;
  photoHash: string;
  userType: UserTypeTextType;
  bannerUrl?: string;
}
export function HeaderProfile({ address, photoHash, name, userType }: Props) {
  const { ipfsGateway } = useSettingsContext();
  return (
    <View className="bg-card-primary pb-5">
      <View className="w-full h-[150]">
        <Image
          source={BGFlorest}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-col items-start pl-5 mt-[-70]">
        <View className={`w-[100] h-[100] rounded-full overflow-hidden border-4 border-white`}>
          <Jazzicon address={address} size={100} />
          {photoHash && (
            <Image 
              source={{ uri: `${ipfsGateway}/ipfs/${photoHash}` }}
              className="w-full h-full rounded-full absolute z-10"
              resizeMode="cover"
            />
          )}
        </View>

        <Text className="font-bold text-white text-2xl">{name}</Text>
        <Text className="text-white">{address}</Text>
        <UserTypeText userType={userType} className="text-gray-300 text-sm"/>
      </View>      
    </View>
  )
}