import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useUploadToIpfs } from "@hooks";

import { BaseRegistrationProps } from "./UserRegistration";
import { Invitation } from "../Invitation";
import { Vacancies } from "../Vacancies";
import { ProofPhoto } from "../ProofPhoto";
import { RegisterBtn } from "../RegisterBtn";

export function Inspector({ name }: BaseRegistrationProps) {
  const { t } = useTranslation();
  const [invitationIsOk, setInvitationIsOk] = useState<boolean>(false);
  const [vacancieIsOk, setVacancieIsOk] = useState<boolean>(false);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  
  const { upload, uploading } = useUploadToIpfs();

  async function handleRegister() {
    if (!proofPhoto) return;

    const response = await upload({ uri: proofPhoto });
    if (!response.isSuccess) return;

  }

  return (
    <View className="gap-3 mb-10">
      <Invitation userType={2} invitationIsOk={setInvitationIsOk} />
      <Vacancies userType={2} vacancieIsOk={setVacancieIsOk} />
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
