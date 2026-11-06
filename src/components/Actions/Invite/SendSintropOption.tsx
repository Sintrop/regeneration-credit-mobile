import { useState } from "react";
import { Switch, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text, TextInput } from "@components";
import { useUserContext } from "@hooks";
import { NATIVE_UNIT, amountToWei, parseAmountInput } from "@utils";

const PRESET_AMOUNTS = ["0.1", "1"];

export interface SendSintropChoice {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  amount: string;
  setAmount: (amount: string) => void;
  /** Amount in wei to send with the invite, or null when not sending. */
  wei: string | null;
  /** True when sending is on but the amount is empty, zero or above the balance. */
  invalid: boolean;
}

/** Optional SINTROP sent to the invited wallet, so it can pay the registration fee. */
export function useSendSintrop(): SendSintropChoice {
  const { balanceSIN } = useUserContext();
  const [enabled, setEnabled] = useState(false);
  const [amount, setAmount] = useState(PRESET_AMOUNTS[0]);
  const wei = enabled ? amountToWei(amount) : null;
  const invalid = enabled && (!wei || BigInt(wei) === 0n || parseAmountInput(amount) > (balanceSIN ?? 0));

  return { enabled, setEnabled, amount, setAmount, wei, invalid };
}

export function SendSintropOption({ choice }: { choice: SendSintropChoice }) {
  const { t, i18n } = useTranslation();
  const { balanceSIN } = useUserContext();
  const [customAmount, setCustomAmount] = useState(false);
  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 5 }).format(value);

  function selectPreset(value: string) {
    setCustomAmount(false);
    choice.setAmount(value);
  }

  function selectCustom() {
    setCustomAmount(true);
    choice.setAmount("");
  }

  return (
    <View className="gap-3 p-3 rounded-xl bg-card-secondary">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-white font-semibold">{t("invite.sendSintrop", { unit: NATIVE_UNIT })}</Text>
          <Text className="text-gray-400 text-xs">{t("invite.sendSintropHint")}</Text>
        </View>
        <Switch value={choice.enabled} onValueChange={choice.setEnabled} />
      </View>

      {choice.enabled && (
        <View className="gap-2">
          <View className="flex-row flex-wrap gap-2">
            {PRESET_AMOUNTS.map(value => {
              const selected = !customAmount && choice.amount === value;
              return (
                <TouchableOpacity
                  key={value}
                  className={`h-9 px-4 rounded-xl items-center justify-center ${selected ? "bg-green-primary" : "border border-green-primary"}`}
                  onPress={() => selectPreset(value)}
                >
                  <Text className={selected ? "text-green-secondary font-semibold" : "text-green-primary"}>
                    {format(Number(value))} {NATIVE_UNIT}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              className={`h-9 px-4 rounded-xl items-center justify-center ${customAmount ? "bg-green-primary" : "border border-green-primary"}`}
              onPress={selectCustom}
            >
              <Text className={customAmount ? "text-green-secondary font-semibold" : "text-green-primary"}>
                {t("invite.otherAmount")}
              </Text>
            </TouchableOpacity>
          </View>

          {customAmount && (
            <TextInput
              label={t("invite.amountLabel", { unit: NATIVE_UNIT })}
              placeholder="0,5"
              value={choice.amount}
              onChangeText={choice.setAmount}
              keyboardType="decimal-pad"
            />
          )}

          <Text className={`text-xs ${choice.invalid ? "text-red-400" : "text-gray-400"}`}>
            {choice.invalid && parseAmountInput(choice.amount) > (balanceSIN ?? 0)
              ? t("invite.insufficientBalance")
              : t("invite.balance", { balance: format(balanceSIN ?? 0), unit: NATIVE_UNIT })}
          </Text>
        </View>
      )}
    </View>
  );
}
