import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Actions, Text, TimerAction } from "@components";
import { UserTimer, useUserTimers } from "@domain";
import { useBlocksDuration } from "@hooks";

const STATUS_COLOR: Record<UserTimer["status"], string> = {
  available: "bg-green-primary",
  waiting: "bg-amber-400",
  inProgress: "bg-blue-primary",
  blocked: "bg-red-400",
  done: "bg-gray-400",
};

function useTimerDescription() {
  const { t } = useTranslation();
  const formatBlocks = useBlocksDuration();

  return (timer: UserTimer): string => {
    const duration = timer.blocks ? formatBlocks(timer.blocks) : "";
    switch (timer.status) {
      case "available":
        return t("timers.availableNow");
      case "waiting":
        return timer.reason === "eraEnding"
          ? t("timers.opensNextEra", { duration })
          : t("timers.availableIn", { duration });
      case "inProgress":
        return timer.key === "requestInspection"
          ? t("timers.pendingInspection")
          : t("timers.inspectionInProgress", { duration });
      case "blocked":
        return t(`timers.blocked.${timer.reason}`);
      case "done":
        return t("timers.missionComplete");
    }
  };
}

/** Every time-gated action of the connected user, read from the contracts; each row opens its action. */
export function UserTimersCard() {
  const { t } = useTranslation();
  const { timers, isLoading } = useUserTimers();
  const describe = useTimerDescription();

  if (!isLoading && timers.length === 0) return null;

  return (
    <View className="mt-2 mb-3 p-4 rounded-2xl bg-card-primary gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-white font-bold">{t("timers.title")}</Text>
        <Actions
          renderTrigger={open => (
            <TouchableOpacity onPress={open} hitSlop={10}>
              <Text className="text-green-primary text-sm font-semibold">{t("timers.allActions")} ›</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        timers.map(timer => (
          <TimerAction key={timer.key} timer={timer}>
            <TimerRow timer={timer} description={describe(timer)} label={t(`timers.actions.${timer.key}`)} />
          </TimerAction>
        ))
      )}
    </View>
  );
}

interface TimerRowProps {
  timer: UserTimer;
  label: string;
  description: string;
  openModal?: () => void;
}

function TimerRow({ timer, label, description, openModal }: TimerRowProps) {
  const actionable = !!openModal && (timer.status === "available" || timer.status === "inProgress");

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 py-1"
      onPress={openModal}
      disabled={!openModal}
      activeOpacity={0.7}
    >
      <View className={`w-2.5 h-2.5 rounded-full ${STATUS_COLOR[timer.status]}`} />
      <View className="flex-1">
        <Text className="text-white">{label}</Text>
        <Text className={`text-xs ${timer.status === "available" ? "text-green-primary" : "text-gray-300"}`}>
          {description}
        </Text>
      </View>
      {actionable && <Text className="text-green-primary text-lg">›</Text>}
    </TouchableOpacity>
  );
}
