import { useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { launchImageLibrary } from 'react-native-image-picker';

import { CameraComponent, Text } from "@components";
import { useAppSafeArea } from "@hooks";

interface Props {
  changePhoto: (uri: string) => void;
}
export function ProofPhoto({ changePhoto }: Props) {
  const { bottom } = useAppSafeArea();
  const modalChoosePhoto = useRef<Modalize>(null);
  const { t } = useTranslation();
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  function openModalChoosePhoto() {
    modalChoosePhoto.current?.open();
  }

  async function handlePickImage() {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets) {
      photoTaked(result.assets[0].uri as string);
    }
  }

  function photoTaked(imageUri: string) {
    modalChoosePhoto.current?.close();
    setShowCamera(false);
    setImage(imageUri);
    changePhoto(imageUri);
  }
  
  return (
    <View className="p-3 rounded-2xl bg-card-primary">
      <Text className="text-gray-300 mb-3">{t('register.proofPhoto')}</Text>

      {image && (
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          className="w-32 h-32 border-2 border-white mb-3 rounded-2xl"
        />
      )}
      <TouchableOpacity
        onPress={openModalChoosePhoto}
        className="w-full h-12 rounded-2xl bg-blue-primary items-center justify-center"
      >
        <Text className="text-white">
          {image ? t('register.selectAnotherImage') : t('register.selectImage')}
        </Text>
      </TouchableOpacity>

      <Portal>
        <Modalize
          ref={modalChoosePhoto}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <View
            className="p-5 bg-white rounded-t-3xl"
            style={{ paddingBottom: bottom }}
          >
            <Text className="font-semibold text-lg text-center text-black">
              {t('register.selectPhotoSource')}
            </Text>

            <Text className="mt-5 text-black">
              {t('register.textConfirmSelectPhotoSource')}
            </Text>

            <View className="mt-10 mb-5 flex-row items-center justify-center">
              <TouchableOpacity
                onPress={handlePickImage}
                className="w-20 h-20 items-center justify-center rounded-2xl bg-gray-300"
              >
                <Text className="text-black font-semibold">
                  {t('register.gallery')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowCamera(true)}
                className="w-20 h-20 items-center justify-center rounded-2xl bg-gray-300 ml-10"
              >
                <Text className="text-black font-semibold">
                  {t('register.camera')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>
      </Portal>

      {showCamera && (
        <CameraComponent
          close={() => setShowCamera(false)}
          photo={photoTaked}
        />
      )}
    </View>
  )
}
