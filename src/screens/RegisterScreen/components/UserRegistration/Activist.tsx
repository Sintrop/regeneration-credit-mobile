/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { useResetNavigation, useTxContext, useUploadToIpfs, useUserContext } from "@hooks";
import { useAddActivist } from "@domain";

import { BaseRegistrationProps } from "./UserRegistration";
import { Invitation } from "../Invitation";
import { Vacancies } from "../Vacancies";
import { ProofPhoto } from "../ProofPhoto";
import { RegisterBtn } from "../RegisterBtn";

export function Activist({ name }: BaseRegistrationProps) {
  const { refetchUser} = useUserContext();
  const { t } = useTranslation();
  const { resetToHomeScreen } = useResetNavigation();

  const [invitationIsOk, setInvitationIsOk] = useState<boolean>(false);
  const [vacancieIsOk, setVacancieIsOk] = useState<boolean>(false);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  
  const { upload, uploading } = useUploadToIpfs();
  const { addActivist } = useAddActivist();
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

    const response = await upload({ uri: proofPhoto });
    if (!response.isSuccess) return;

    addActivist({
      name,
      proofPhoto: response.hash,
    })
  }

  return (
    <View className="gap-3 mb-10">
      <Invitation userType={6} invitationIsOk={setInvitationIsOk} />
      <Vacancies userType={6} vacancieIsOk={setVacancieIsOk} />
      <ProofPhoto changePhoto={setProofPhoto} />
  
      <RegisterBtn 
        label={t('register.title')}
        onPress={handleRegister}
        disabled={!name.trim() || !invitationIsOk || !vacancieIsOk || !proofPhoto}
        isLoading={uploading}
      />
    </View>
  )
}
