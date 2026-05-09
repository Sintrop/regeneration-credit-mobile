import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useImpactPerEra } from "@domain";
import { Text } from "@components";

import { ImpactItem } from "./ImpactItem";

// Helper to format with dot for thousands (1.000.000)
function formatWithDots(value?: number): string {
  if (value === undefined || value === null) return '0';
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function ImpactPerEra() {
  const { t } = useTranslation();
  const { isLoading, impactPerEra } = useImpactPerEra({ era: 1 });

  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-white">{t('tokenImpact.totalImpactPerEra')}</Text>
        <View className="h-6 px-2 rounded-full bg-green-500 items-center justify-center">
          <Text className="text-xs text-white">ERA 1</Text>
        </View>
      </View>
      <View className="flex-row gap-3 w-full">
        <ImpactItem 
          label={t('common.trees')}
          value={formatWithDots(impactPerEra?.totalTress)}
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('common.biodiversity')}
          value={formatWithDots(impactPerEra?.totalBiodiversity)}
          isLoading={isLoading}
        />
      </View>
      <View className="flex-row gap-3 w-full mt-2">
        <ImpactItem 
          label={t('common.inspections')}
          value={formatWithDots(impactPerEra?.totalInspections)}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}