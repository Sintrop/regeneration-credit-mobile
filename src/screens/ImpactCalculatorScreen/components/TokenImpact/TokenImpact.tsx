import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, Text } from "@components";
import { useImpactPerToken } from "@domain";
import { formatArea } from "@utils";

export function TokenImpact() {
  const { t, i18n } = useTranslation();
  const { carbon, trees, biodiversity, area } = useImpactPerToken();
  const formatNumber = (value: number) => Intl.NumberFormat(i18n.language, { maximumSignificantDigits: 4 }).format(value || 0);

  return (
    <View>
      <View className="flex-row items-center gap-2">
        <Icon name='rc' />
        <Text className="text-white">{t('impactCalculator.impactPerToken')}</Text>
      </View>
      <View className="mt-2 gap-3">
        <View className="flex-row gap-3 w-full">
          <ImpactItem 
            label={t('common.trees')}
            value={formatNumber(trees)}
          />
          <ImpactItem 
            label={t('common.carbon')}
            value={formatNumber(carbon)}
            suffix="g"
          />
        </View>
        <View className="flex-row gap-3 w-full">
          <ImpactItem 
            label={t('common.biodiversity')}
            value={formatNumber(biodiversity)}
          />
          <ImpactItem 
            label={t('common.area')}
            value={formatArea(area, i18n.language)}
          />
        </View>
      </View>
    </View>
  );
}

interface ImpactItemProps {
  label: string;
  value?: number | string;
  suffix?: string;
}
function ImpactItem({ label, value, suffix }: ImpactItemProps) {
  return (
    <View className="flex-1 p-3 rounded-2xl bg-card-primary">
      <Text className="text-white text-lg font-semibold" numberOfLines={1}>{value} {suffix && suffix}</Text>
      <Text className="text-gray-300 text-sm">{label}</Text>
    </View>
  )
}
