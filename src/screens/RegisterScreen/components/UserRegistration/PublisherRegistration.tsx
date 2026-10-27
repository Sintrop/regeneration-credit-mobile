import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { CONTRACT_LIMITS, PublisherUserType, usePublisherTransactions } from "@domain";
import { useResetNavigation, useTxContext, useUploadToIpfs, useUserContext } from "@hooks";
import { fitsBytes } from "@utils";
import { Text } from "@components";

import { BaseRegistrationProps } from "./UserRegistration";
import { Invitation } from "../Invitation";
import { Vacancies } from "../Vacancies";
import { ProofPhoto } from "../ProofPhoto";
import { RegisterBtn } from "../RegisterBtn";

interface Props extends BaseRegistrationProps {
  userType: PublisherUserType;
}

/** Researcher, developer and contributor registration: invitation + vacancy + proof photo, then add<Type>(name, proofPhoto). */
export function PublisherRegistration({ name, userType }: Props) {
  const { t } = useTranslation();
  const { refetchUser } = useUserContext();
  const { resetToHomeScreen } = useResetNavigation();
  const { registerContinueAction } = useTxContext();
  const { upload, uploading } = useUploadToIpfs();
  const { register } = usePublisherTransactions(userType);

  const [invitationIsOk, setInvitationIsOk] = useState(false);
  const [vacancieIsOk, setVacancieIsOk] = useState(false);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);

  const nameFits = fitsBytes(name.trim(), CONTRACT_LIMITS.name);

  async function handleRegister() {
    if (!proofPhoto) return;
    const response = await upload({ uri: proofPhoto });
    if (!response.isSuccess) return;

    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("register.successRegister") });
      refetchUser();
      resetToHomeScreen();
    });
    register(name.trim(), response.hash);
  }

  return (
    <View className="gap-3 mb-10">
      <Invitation userType={userType} invitationIsOk={setInvitationIsOk} />
      <Vacancies userType={userType} vacancieIsOk={setVacancieIsOk} />
      <ProofPhoto changePhoto={setProofPhoto} />

      {!nameFits && (
        <Text className="text-red-400">{t("register.nameTooLong", { max: CONTRACT_LIMITS.name })}</Text>
      )}

      <RegisterBtn
        label={t("register.title")}
        onPress={handleRegister}
        disabled={!name.trim() || !nameFits || !invitationIsOk || !vacancieIsOk || !proofPhoto}
        isLoading={uploading}
      />
    </View>
  );
}
