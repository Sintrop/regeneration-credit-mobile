import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { FileInput, PickedFile } from "@components";
import { CONTRACT_LIMITS, PublisherUserType, usePublisherTransactions } from "@domain";
import { useTxContext, useUploadToIpfs } from "@hooks";
import { fitsBytes } from "@utils";

import { ByteLimitedInput } from "./ByteLimitedInput";
import { PublishStatus } from "./PublishStatus";
import { SubmitButton } from "./SubmitButton";
import { usePublishAvailability } from "./usePublishAvailability";

interface Props {
  userType: PublisherUserType;
  onDone: () => void;
}

/** Research (title, thesis, file) for researchers; report or contribution (description, file) for developers and contributors. */
export function PublishResourceForm({ userType, onDone }: Props) {
  const { t } = useTranslation();
  const { registerContinueAction } = useTxContext();
  const { upload, uploading } = useUploadToIpfs();
  const { publish } = usePublisherTransactions(userType);
  const { availability, isLoading, refetch } = usePublishAvailability(userType);

  const isResearch = userType === 3;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<PickedFile | null>(null);

  const valid =
    !!file &&
    text.trim().length > 0 &&
    fitsBytes(text, CONTRACT_LIMITS.text) &&
    (!isResearch || (title.trim().length > 0 && fitsBytes(title, CONTRACT_LIMITS.title)));

  async function handleSubmit() {
    if (!file || !valid) return;
    const response = await upload({ uri: file.uri, name: file.name, type: file.type });
    if (!response.isSuccess) return;

    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("publisher.published") });
      setTitle("");
      setText("");
      setFile(null);
      refetch();
      onDone();
    });

    publish(isResearch ? [title.trim(), text.trim(), response.hash] : [text.trim(), response.hash]);
  }

  if (isLoading || !availability) {
    return <ActivityIndicator color="white" />;
  }

  return (
    <View className="gap-4">
      <PublishStatus availability={availability} />

      {isResearch && (
        <ByteLimitedInput label={t("publisher.researchTitle")} value={title} onChangeText={setTitle} maxBytes={CONTRACT_LIMITS.title} />
      )}

      <ByteLimitedInput
        label={isResearch ? t("publisher.thesis") : t("publisher.description")}
        value={text}
        onChangeText={setText}
        maxBytes={CONTRACT_LIMITS.text}
        multiline
      />

      <FileInput label={t("publisher.file")} onChange={() => {}} onPickFile={setFile} />

      <SubmitButton
        label={t("publisher.publish")}
        onPress={handleSubmit}
        disabled={!availability.canPublish || !valid}
        isLoading={uploading}
      />
    </View>
  );
}
