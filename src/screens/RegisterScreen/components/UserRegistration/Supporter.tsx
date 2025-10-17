/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text, TextInput } from "@components";
import { useAddSupporter } from "@domain";
import { useSettingsContext, useTxContext } from "@hooks";
import { uploadToIpfs } from "@services";

import { BaseRegistrationProps } from "./UserRegistration";
import { ProofPhoto } from "../ProofPhoto";
import Toast from "react-native-toast-message";

export function Supporter({ name }: BaseRegistrationProps) {
  const { ipfsApi } = useSettingsContext();
  const { t } = useTranslation();
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
      })
    })
  }, []);

  async function handleAddSupporter() {
    let proofPhotoHash = '';

    if (proofPhoto) {
      const response = await uploadToIpfs({
        ipfsApiUrl: ipfsApi,
        file: proofPhoto
      })
      if (response.success) proofPhotoHash = response.hash;
    }

    addSupporter({
      name,
      description,
      profilePhoto: proofPhotoHash
    })
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

      <TouchableOpacity
        className="w-full h-12 rounded-2xl items-center justify-center bg-green-primary mb-10 disabled:opacity-50"
        onPress={handleAddSupporter}
        disabled={!name.trim() || !description.trim()}
      >
        <Text className="text-white font-semibold">{t('register.title')}</Text>
      </TouchableOpacity>
    </View>
  )
}
