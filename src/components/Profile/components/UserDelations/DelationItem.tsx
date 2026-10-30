import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { DelationProps } from "@domain";

interface Props {
  delation: DelationProps
}

export function DelationItem({ delation }: Props) {
  const { t } = useTranslation();
  const informer = delation.informer
    ? `${delation.informer.slice(0, 6)}...${delation.informer.slice(-4)}`
    : '';

  return (
    <View className="w-full py-3 gap-1 border-b border-card-secondary">
      {!!delation.title && (
        <Text className="text-white font-semibold">{delation.title}</Text>
      )}
      {!!delation.testimony && (
        <Text className="text-gray-300">{delation.testimony}</Text>
      )}
      <Text className="text-gray-400 text-xs">
        {informer}
        {!!delation.createdAt && ` • ${t('common.block')} ${delation.createdAt}`}
      </Text>
    </View>
  );
}
