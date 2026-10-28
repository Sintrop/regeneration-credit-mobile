import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Offset, Text, TextInput, UserBadge } from "@components";
import { CalculatorItemProps, useDeclareReductionCommitment } from "@domain";
import { useUserContext } from "@hooks";
import { AppStackParamsList } from "@routes";
import { parseAmountInput } from "@utils";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "ImpactCalculatorScreen">;

interface Props {
  item: CalculatorItemProps;
  /** Grams of CO₂ per RC (RegenerationCreditImpact.carbonPerToken). */
  carbonPerToken: number;
}

export function CalculatorItem({ item, carbonPerToken }: Props) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { userType } = useUserContext();
  const { declareReductionCommitment } = useDeclareReductionCommitment();
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState("");

  const format = (value: number, digits = 2) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value);
  const rcPerUnit = carbonPerToken > 0 ? item.carbonImpact / carbonPerToken : 0;
  const units = parseAmountInput(quantity);
  const rcNeeded = units > 0 ? units * rcPerUnit : 0;
  const isSupporter = userType === 7;

  function handleCommit() {
    Alert.alert(
      t("impactCalculator.declareCommitment"),
      t("impactCalculator.declareCommitmentQuestion", { item: item.item }),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("impactCalculator.declare"), onPress: () => declareReductionCommitment(item.id) },
      ]
    );
  }

  return (
    <View className="rounded-2xl bg-card-primary overflow-hidden">
      <TouchableOpacity className="p-4 gap-2" onPress={() => setExpanded(value => !value)} activeOpacity={0.8}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-white font-bold text-base">{item.item}</Text>
            <Text className="text-gray-400 text-xs">
              {t("impactCalculator.perUnit", { impact: format(item.carbonImpact, 0), unit: item.unit })}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-green-primary font-bold">{format(rcPerUnit)} RC</Text>
            <Text className="text-gray-400 text-[11px]">{t("impactCalculator.perOneUnit", { unit: item.unit })}</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-xs">{expanded ? t("impactCalculator.showLess") : t("impactCalculator.showMore")}</Text>
      </TouchableOpacity>

      {expanded && (
        <View className="px-4 pb-4 gap-4 border-t border-card-secondary pt-4">
          {!!item.thesis?.trim() && <Text className="text-gray-200 text-sm">{item.thesis.trim()}</Text>}

          <UserBadge
            address={item.researcher}
            label={t("impactCalculator.publishedBy")}
            onPress={address => navigation.navigate("UserDetailsScreen", { address })}
          />

          <View className="gap-2 p-3 rounded-xl border border-green-primary/30">
            <TextInput
              label={t("offset.howManyUnitsToOffset", { unit: item.unit })}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
              placeholder="Ex: 10"
            />
            {rcNeeded > 0 && (
              <Text className="text-green-primary font-semibold">
                {t("impactCalculator.quickResult", {
                  tokens: format(rcNeeded),
                  carbon: format((units * item.carbonImpact) / 1000),
                })}
              </Text>
            )}
          </View>

          {isSupporter && (
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Offset item={item}>
                  <ActionButton label={t("common.offsetAction")} primary />
                </Offset>
              </View>
              <View className="flex-1">
                <ActionButton label={t("impactCalculator.commitment")} openModal={handleCommit} />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function ActionButton({ openModal, label, primary }: { openModal?: () => void; label: string; primary?: boolean }) {
  return (
    <TouchableOpacity
      onPress={openModal}
      className={`h-11 rounded-2xl items-center justify-center ${primary ? "bg-green-primary" : "border border-green-primary"}`}
    >
      <Text className={`font-semibold ${primary ? "text-green-secondary" : "text-green-primary"}`}>{label}</Text>
    </TouchableOpacity>
  );
}
