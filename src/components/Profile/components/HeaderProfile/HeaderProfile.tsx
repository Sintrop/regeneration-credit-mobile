import { useState } from "react";
import { Image, View, TouchableOpacity, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";

import { Text, UserTypeText, UserTypeTextType } from "@components";

//@ts-ignore
import BGFlorest from "../../../../assets/images/bg-florest.jpg";
import Jazzicon from "react-native-jazzicon";
import { useSettingsContext, useUserContext } from "@hooks";

import { TransferModal } from "../../../../screens/MyTokensScreen/components/TransferModal";

interface Props {
  address: string;
  name: string;
  photoHash: string;
  userType: UserTypeTextType;
  bannerUrl?: string;
}

export function HeaderProfile({ address, photoHash, name, userType }: Props) {
  const { ipfsGateway } = useSettingsContext();
  const { t } = useTranslation();
  const { address: connectedAddress, isConnected } = useUserContext();
  const [showTransfer, setShowTransfer] = useState(false);
  const canTransfer = isConnected && !!connectedAddress && connectedAddress.toLowerCase() !== address.toLowerCase();

  const handleAddressClick = () => {
    Clipboard.setString(address);
    Alert.alert(t('common.addressCopied'), t('common.addressCopiedDescription'));
  };

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
        
        <TouchableOpacity onPress={handleAddressClick}>
          <Text className="text-white">{address}</Text>
        </TouchableOpacity>

        <UserTypeText userType={userType} className="text-gray-300 text-sm"/>

        {canTransfer && (
          <TouchableOpacity
            className="mt-3 h-10 px-5 rounded-xl items-center justify-center bg-green-primary"
            onPress={() => setShowTransfer(true)}
          >
            <Text className="text-green-secondary font-semibold">{t("profile.transferTo")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {canTransfer && (
        <TransferModal
          visible={showTransfer}
          onClose={() => setShowTransfer(false)}
          recipient={{ address, name }}
        />
      )}
    </View>
  )
}