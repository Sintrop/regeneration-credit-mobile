import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { Text } from "@components";
import { CONTRACT_LIMITS, usePublisherTransactions } from "@domain";
import { useTxContext } from "@hooks";
import { fitsBytes } from "@utils";

import { ByteLimitedInput } from "./ByteLimitedInput";
import { SubmitButton } from "./SubmitButton";
import { usePublishAvailability } from "./usePublishAvailability";

/** ResearcherRules.addEvaluationMethod(title, research, projectURL): one per researcher. */
export function EvaluationMethodForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const { registerContinueAction } = useTxContext();
  const { addEvaluationMethod } = usePublisherTransactions(3);
  const { rules, isLoading, refetch } = usePublishAvailability(3);

  const [title, setTitle] = useState("");
  const [research, setResearch] = useState("");
  const [projectURL, setProjectURL] = useState("");

  const valid =
    title.trim().length > 0 && fitsBytes(title, CONTRACT_LIMITS.title) &&
    research.trim().length > 0 && fitsBytes(research, CONTRACT_LIMITS.text) &&
    projectURL.trim().length > 0 && fitsBytes(projectURL, CONTRACT_LIMITS.hash);

  function handleSubmit() {
    if (!valid) return;
    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("publisher.published") });
      refetch();
      onDone();
    });
    addEvaluationMethod(title.trim(), research.trim(), projectURL.trim());
  }

  if (isLoading || !rules) {
    return <ActivityIndicator color="white" />;
  }

  if (!rules.canPublishMethod) {
    return (
      <View className="p-3 rounded-xl bg-card-secondary">
        <Text className="text-gray-200">{t("publisher.methodAlreadyPublished")}</Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <ByteLimitedInput label={t("publisher.methodTitle")} value={title} onChangeText={setTitle} maxBytes={CONTRACT_LIMITS.title} />
      <ByteLimitedInput label={t("publisher.methodResearch")} value={research} onChangeText={setResearch} maxBytes={CONTRACT_LIMITS.text} multiline />
      <ByteLimitedInput
        label={t("publisher.methodProjectUrl")}
        placeholder="https://"
        value={projectURL}
        onChangeText={setProjectURL}
        maxBytes={CONTRACT_LIMITS.hash}
        keyboardType="url"
        autoCapitalize="none"
      />
      <SubmitButton label={t("publisher.publishMethod")} onPress={handleSubmit} disabled={!valid} />
    </View>
  );
}
