import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { PublishAvailability } from "@domain";
import { useBlocksDuration } from "@hooks";

/** Explains why publishing is closed right now, with the remaining time. */
export function PublishStatus({ availability }: { availability: PublishAvailability }) {
  const { t } = useTranslation();
  const formatBlocks = useBlocksDuration();

  if (availability.canPublish) return null;

  return (
    <View className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 gap-1">
      <Text className="text-amber-300 font-semibold">
        {availability.reason === "eraEnding" ? t("publisher.eraEndingTitle") : t("publisher.waitTitle")}
      </Text>
      <Text className="text-gray-200 text-sm">
        {availability.reason === "eraEnding"
          ? t("publisher.eraEndingDescription", { duration: formatBlocks(availability.blocksToWait) })
          : t("publisher.waitDescription", { duration: formatBlocks(availability.blocksToWait) })}
      </Text>
    </View>
  );
}
