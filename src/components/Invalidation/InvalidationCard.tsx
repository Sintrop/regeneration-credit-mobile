import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Toast from "react-native-toast-message";

import { Text, TextInput } from "@components";
import { ValidationTarget, useValidationStatus, useVoteToInvalidate } from "@domain";
import { useAppSafeArea, useBlocksDuration, useKeyboardStatus, useTxContext } from "@hooks";
import { fitsBytes, utf8ByteLength } from "@utils";

const MAX_JUSTIFICATION_BYTES = 300;

interface Props {
  target: ValidationTarget;
  /** Resource id, or the user address for target "user". */
  idOrAddress?: string | number;
}

/** Invalidation votes (x/y), whether voting is still open this era, and the vote action for voters. */
export function InvalidationCard({ target, idOrAddress }: Props) {
  const { t } = useTranslation();
  const formatBlocks = useBlocksDuration();
  const { status, eligibility, isLoading, refetch } = useValidationStatus(target, idOrAddress);

  if (isLoading || !status || !eligibility) {
    return (
      <View className="p-4 rounded-2xl bg-card-primary">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  const { votes, votesNeeded } = status;
  const progress = votesNeeded > 0 ? Math.min(1, votes / votesNeeded) : 0;
  const closedReason = !eligibility.open ? eligibility.reason : undefined;

  return (
    <View className="p-4 rounded-2xl bg-card-primary gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-300 text-sm">{t("invalidation.title")}</Text>
        <Text className="text-white font-bold">{t("invalidation.votes", { votes, needed: votesNeeded })}</Text>
      </View>

      <View className="h-2 rounded-full bg-card-secondary overflow-hidden">
        <View className="h-2 rounded-full bg-red-400" style={{ width: `${progress * 100}%` }} />
      </View>

      <Text className="text-gray-300 text-sm">
        {closedReason
          ? t(`invalidation.closed.${closedReason}`)
          : t("invalidation.openUntil", { duration: formatBlocks(status.blocksToEraEnd) })}
      </Text>

      {eligibility.open && eligibility.reason !== "notVoterType" && (
        <VoteSection
          target={target}
          idOrAddress={idOrAddress as string | number}
          canVote={eligibility.canVote}
          blockedText={eligibility.reason
            ? t(`invalidation.voterBlocked.${eligibility.reason}`, { duration: formatBlocks(status.voter.blocksToNextVote) })
            : undefined}
          onVoted={refetch}
        />
      )}
    </View>
  );
}

interface VoteSectionProps {
  target: ValidationTarget;
  idOrAddress: string | number;
  canVote: boolean;
  blockedText?: string;
  onVoted: () => void;
}

function VoteSection({ target, idOrAddress, canVote, blockedText, onVoted }: VoteSectionProps) {
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();
  const { keyboardHeight, keyboardOpen } = useKeyboardStatus();
  const { registerContinueAction } = useTxContext();
  const { vote } = useVoteToInvalidate();
  const modal = useRef<Modalize>(null);
  const [justification, setJustification] = useState("");

  const used = utf8ByteLength(justification);
  const valid = justification.trim().length > 0 && fitsBytes(justification, MAX_JUSTIFICATION_BYTES);

  function handleVote() {
    if (!valid) return;
    registerContinueAction(() => {
      Toast.show({ type: "success", text1: t("invalidation.voteSent") });
      setJustification("");
      modal.current?.close();
      onVoted();
    });
    vote(target, idOrAddress, justification.trim());
  }

  return (
    <View className="gap-2">
      {!!blockedText && <Text className="text-amber-300 text-sm">{blockedText}</Text>}

      <TouchableOpacity
        className="h-11 rounded-2xl items-center justify-center border border-red-400 disabled:opacity-40"
        disabled={!canVote}
        onPress={() => modal.current?.open()}
      >
        <Text className="text-red-400 font-semibold">{t("invalidation.voteButton")}</Text>
      </TouchableOpacity>

      <Portal>
        <Modalize ref={modal} adjustToContentHeight modalStyle={{ backgroundColor: "transparent" }}>
          <View className="rounded-t-2xl p-5 bg-card-primary">
            <ScrollView
              contentContainerStyle={{ gap: 16, paddingBottom: (keyboardOpen ? keyboardHeight : bottom) + 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text className="text-white text-center font-semibold">{t("invalidation.voteButton")}</Text>
              <Text className="text-gray-300">{t(`invalidation.voteDescription.${target === "user" ? "user" : "resource"}`)}</Text>
              <View className="gap-1">
                <TextInput
                  label={t("invalidation.justification")}
                  value={justification}
                  onChangeText={setJustification}
                  multiline
                />
                <Text className={`text-xs text-right ${used > MAX_JUSTIFICATION_BYTES ? "text-red-400" : "text-gray-400"}`}>
                  {used}/{MAX_JUSTIFICATION_BYTES}
                </Text>
              </View>
              <TouchableOpacity
                className="h-12 rounded-2xl items-center justify-center bg-red-500 disabled:opacity-40"
                disabled={!valid}
                onPress={handleVote}
              >
                <Text className="text-white font-bold">{t("invalidation.confirmVote")}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
}
