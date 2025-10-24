import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { Map, Text, TextInput } from "@components";
import { calculateArea } from "@services";
import { useResetNavigation, useTxContext, useUploadToIpfs, useUserContext } from "@hooks";
import { CoordinateProps, useAddRegenerator } from "@domain";

import { BaseRegistrationProps } from "./UserRegistration";
import { ProofPhoto } from "../ProofPhoto";
import { RegisterBtn } from "../RegisterBtn";

export function Regenerator({ name }: BaseRegistrationProps) {
  const { t } = useTranslation();
  const [coordinates, setCoordinates] = useState<CoordinateProps[]>([]);
  const areaSize = calculateArea(coordinates);
  const [description, setDescription] = useState<string>('');
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);

  const { addRegenerator } = useAddRegenerator();
  const { resetToHomeScreen } = useResetNavigation();
  const { refetchUser} = useUserContext();
  const { upload, uploading } = useUploadToIpfs();
  const { registerContinueAction } = useTxContext();
  
  useEffect(() => {
    registerContinueAction(() => {
      //action success
      Toast.show({
        type: 'success',
        text1: t('register.successRegister')
      });
      refetchUser();
      resetToHomeScreen();
    })
  }, []);

  async function handleRegister() {
    if (!proofPhoto) return;
    let proofPhotoHash = '';

    const response = await upload({ uri: proofPhoto });
    if (!response.isSuccess) return;
    proofPhotoHash = response.hash;

    addRegenerator({
      name,
      coordinates,
      projectDescription: description,
      proofPhoto: proofPhotoHash,
      totalArea: areaSize
    })
  }

  return (
    <View className="gap-5 mb-5">
      <View className="p-3 rounded-2xl bg-card-primary">
        <TextInput
          label={t('register.projectDescription')}
          value={description}
          onChangeText={setDescription}
          className="w-full h-12 rounded-2xl bg-card-secondary text-white px-3"
          placeholder={t('common.typeHere')}
        />
      </View>

      <ProofPhoto changePhoto={setProofPhoto} />

      <View className="p-3 rounded-2xl bg-card-primary">
        <Map
          label={t('register.regenerationArea')}
          description={t('register.descriptionRegenerationArea')}
          onChangeCoords={setCoordinates}
          mapStyle={{ width: '100%', height: 250 }} 
          showMarkers 
          showPolyline 
          collectCoords 
          showDeleteButtons
          zoom={17}
        />

        {coordinates.length > 0 && (
          <View className="mt-3">
            <Text className="text-gray-300 text-sm">{t('register.coordinates')}</Text>

            {coordinates.map((item, index) => (
              <Text
                key={index}
                className="text-white"
              >
                {index + 1} - Lat: {item.latitude}; Lng: {item.longitude}
              </Text>
            ))}

            <Text className="text-white mt-3">
              {t('register.areaSize')}: {Intl.NumberFormat('pt-BR').format(areaSize)} m2
            </Text>
          </View>
        )}
      </View>

      <RegisterBtn
        label={t('register.title')}
        onPress={handleRegister}
        disabled={!name.trim() || !description.trim() || !proofPhoto || coordinates.length < 3 || areaSize < 3500}
        isLoading={uploading}
      />
    </View>
  )
}
