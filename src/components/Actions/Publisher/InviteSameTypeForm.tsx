import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { utils } from "web3";

import { Text, TextInput } from "@components";
import { PublisherUserType, useBlockNumber, usePublisherTransactions } from "@domain";
import { useBlocksDuration, useTxContext } from "@hooks";

import { SubmitButton } from "./SubmitButton";
import { usePublishAvailability } from "./usePublishAvailability";

/** InvitationRules.invite: researchers invite researchers, developers invite developers, contributors invite contributors. */
export function InviteSameTypeForm({ userType, onDone }: { userType: PublisherUserType; onDone: () => void }) {
  const { t } = useTranslation();
  const { registerContinueAction } = useTxContext();
  const { invite } = usePublisherTransactions(userType);
  const { rules, isLoading } = usePublishAvailability(userType);
  const { blockNumber } = useBlockNumber();
  const formatBlocks = useBlocksDuration();
  const [wallet, setWallet] = useState("");
  const isAddress = utils.isAddress(wallet.trim());

  // InvitationRules: block.number - lastInviteBlock >= invitationDelayBlocks, or never invited
  const delayLeft = rules && rules.lastInviteBlock > 0
    ? rules.lastInviteBlock + rules.invitationDelayBlocks - blockNumber
    : 0;

  function handleInvite() {
    if (!isAddress) return;
    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("actions.inviteSent") });
      setWallet("");
      onDone();
    });
    invite(wallet.trim());
  }

  if (isLoading || !rules) {
    return <ActivityIndicator color="white" />;
  }

  const blockedReason = !rules.canSendInvite
    ? t("publisher.inviteLevelRequired")
    : delayLeft > 0
      ? t("publisher.inviteDelay", { duration: formatBlocks(delayLeft) })
      : null;

  return (
    <View className="gap-4">
      {!!blockedReason && (
        <View className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30">
          <Text className="text-gray-200 text-sm">{blockedReason}</Text>
        </View>
      )}
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
      <SubmitButton label={t("actions.invite")} onPress={handleInvite} disabled={!isAddress || !!blockedReason} />
    </View>
  );
}
