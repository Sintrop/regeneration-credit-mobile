import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

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

  return (
    <View className="gap-3 mb-10">
      <Invitation userType={2} invitationIsOk={setInvitationIsOk} />
      <Vacancies userType={2} vacancieIsOk={setVacancieIsOk} />
      <ProofPhoto changePhoto={setProofPhoto} />
      <RegisterBtn 
        label={t('register.title')}
        onPress={() => {}}
        disabled={!name.trim() || !invitationIsOk || !vacancieIsOk || !proofPhoto}
      />
    </View>
  )
}
