import { ReactNode, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { utils } from "web3";
import Toast from "react-native-toast-message";

import { Text, TextInput } from "@components";
import { useInvite } from "@domain";
import { useTxContext } from "@hooks";

import { ActionSheet } from "../Publisher/ActionSheet";
import { SubmitButton } from "../Publisher/SubmitButton";

/** SupporterRules.offset pays INVITER_PERCENTAGE (5%) of each offset made by an invited supporter to the inviter. */
function InviteSupporterForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const { registerContinueAction } = useTxContext();
  const { invite } = useInvite();
  const [wallet, setWallet] = useState("");
  const isAddress = utils.isAddress(wallet.trim());

  function handleInvite() {
    if (!isAddress) return;
    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("actions.inviteSent") });
      setWallet("");
      onDone();
    });
    invite({ address: wallet.trim(), userType: 7 });
  }

  return (
    <View className="gap-4">
      <View className="p-3 rounded-xl bg-green-primary/10 border border-green-primary/40">
        <Text className="text-white text-sm">{t("actions.inviteSupporterCommission")}</Text>
      </View>
      <View className="gap-1">
        <TextInput
          label={t("actions.walletWantToInvite")}
          placeholder="0x..."
          value={wallet}
          onChangeText={setWallet}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!!wallet && !isAddress && <Text className="text-red-400 text-xs">{t("common.invalidAddress")}</Text>}
      </View>
      <SubmitButton label={t("actions.invite")} onPress={handleInvite} disabled={!isAddress} />
    </View>
  );
}

export function InviteSupporter({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <ActionSheet
      title={t("actions.inviteSupporter")}
      description={t("actionsDescriptions.inviteSupporter")}
      content={({ close }) => <InviteSupporterForm onDone={close} />}
    >
      {children}
    </ActionSheet>
  );
}
