import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@components";
import { useImpactPerEra } from "@domain";

export function TokenImpact() {
  const { t } = useTranslation();
  const { impactPerEra } = useImpactPerEra({ era: 1 });

  return (
    <View>
      <Text className="text-white text-center">{t('impactCalculator.tokenImpact')}</Text>

      <Text className="text-gray-300">{t('impactCalculator.totalImpactEra')} 1</Text>
      <View className="mt-1 gap-3">
        <View className="flex-row gap-3 w-full">
          <ImpactItem 
            label={t('common.trees')}
            value={impactPerEra?.totalTress}
          />
          <ImpactItem 
            label={t('common.biodiversity')}
            value={impactPerEra?.totalBiodiversity}
          />
        </View>
        <ImpactItem 
          label={t('common.inspections')}
          value={impactPerEra?.totalInspections}
        />
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
