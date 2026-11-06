import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { Text, TextInput } from "@components";
import { CONTRACT_LIMITS, usePublisherTransactions } from "@domain";
import { useTxContext } from "@hooks";
import { fitsBytes } from "@utils";

import { ByteLimitedInput } from "./ByteLimitedInput";
import { PublishStatus } from "./PublishStatus";
import { SubmitButton } from "./SubmitButton";
import { usePublishAvailability } from "./usePublishAvailability";

/** ResearcherRules.addCalculatorItem(item, thesis, unit, carbonImpact in grams CO2e per unit). */
export function CalculatorItemForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const { registerContinueAction } = useTxContext();
  const { addCalculatorItem } = usePublisherTransactions(3);
  const { availability, isLoading, refetch } = usePublishAvailability(3, "calculatorItem");

  const [item, setItem] = useState("");
  const [thesis, setThesis] = useState("");
  const [unit, setUnit] = useState("");
  const [carbonImpact, setCarbonImpact] = useState("");

  const impact = /^\d+$/.test(carbonImpact.trim()) ? Number(carbonImpact.trim()) : NaN;
  const impactValid = impact >= CONTRACT_LIMITS.minCarbonImpact && impact <= CONTRACT_LIMITS.maxCarbonImpact;
  const valid =
    item.trim().length > 0 && fitsBytes(item, CONTRACT_LIMITS.calculatorItem) &&
    thesis.trim().length > 0 && fitsBytes(thesis, CONTRACT_LIMITS.text) &&
    unit.trim().length > 0 && fitsBytes(unit, CONTRACT_LIMITS.calculatorUnit) &&
    impactValid;

  function handleSubmit() {
    if (!valid) return;
    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("publisher.published") });
      setItem("");
      setThesis("");
      setUnit("");
      setCarbonImpact("");
      refetch();
      onDone();
    });
    addCalculatorItem(item.trim(), thesis.trim(), unit.trim(), String(impact));
  }

  if (isLoading || !availability) {
    return <ActivityIndicator color="white" />;
  }

  return (
    <View className="gap-4">
      <PublishStatus availability={availability} />
      <ByteLimitedInput label={t("publisher.itemName")} placeholder={t("publisher.itemNamePlaceholder")} value={item} onChangeText={setItem} maxBytes={CONTRACT_LIMITS.calculatorItem} />
      <ByteLimitedInput label={t("publisher.itemThesis")} value={thesis} onChangeText={setThesis} maxBytes={CONTRACT_LIMITS.text} multiline />
      <ByteLimitedInput label={t("publisher.itemUnit")} placeholder={t("publisher.itemUnitPlaceholder")} value={unit} onChangeText={setUnit} maxBytes={CONTRACT_LIMITS.calculatorUnit} />
      <View className="gap-1">
        <TextInput
          label={t("publisher.carbonImpact")}
          value={carbonImpact}
          onChangeText={setCarbonImpact}
          keyboardType="number-pad"
          placeholder="Ex: 2580"
        />
        {!!carbonImpact && !impactValid && (
          <Text className="text-red-400 text-xs">{t("publisher.carbonImpactRange")}</Text>
        )}
      </View>
      <SubmitButton label={t("publisher.publishItem")} onPress={handleSubmit} disabled={!availability.canPublish || !valid} />
    </View>
  );
}
