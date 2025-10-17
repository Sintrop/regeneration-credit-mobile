/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { TextInput } from "@components";
import { useAddSupporter } from "@domain";
import { useResetNavigation, useSettingsContext, useTxContext, useUserContext } from "@hooks";
import { uploadToIpfs } from "@services";

import { BaseRegistrationProps } from "./UserRegistration";
import { ProofPhoto } from "../ProofPhoto";
import { RegisterBtn } from "../RegisterBtn";

export function Supporter({ name }: BaseRegistrationProps) {
  const { resetToHomeScreen } = useResetNavigation();
  const { ipfsApi } = useSettingsContext();
  const { refetchUser } = useUserContext();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);

  const { registerContinueAction } = useTxContext();
  const { addSupporter } = useAddSupporter();
  
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

  async function handleAddSupporter() {
    let proofPhotoHash = '';
    setIsLoading(true);
    if (proofPhoto) {
      const response = await uploadToIpfs({
        ipfsApiUrl: ipfsApi,
        file: proofPhoto
      })
      if (response.success) {
        proofPhotoHash = response.hash;
      } else {
        Toast.show({
          type: 'error',
          text1: t('common.erroOnUploadFileToIpfs')
        })
        setIsLoading(false);
        return
      }
    }

    addSupporter({
      name,
      description,
      profilePhoto: proofPhotoHash
    })
    setIsLoading(false);
  }

  return (
    <View className="gap-5">
      <View className="p-3 rounded-2xl bg-card-primary">
        <TextInput
          label={t('register.description')}
          value={description}
          onChangeText={setDescription}
          className="w-full h-12 rounded-2xl bg-card-secondary text-white px-3"
          placeholder={t('common.typeHere')}
        />
      </View>

      <ProofPhoto changePhoto={setProofPhoto} />

      <RegisterBtn
        label={t('register.title')}
        onPress={handleAddSupporter}
        disabled={!name.trim() || !description.trim()}
        isLoading={isLoading}
      />
    </View>
  )
}
