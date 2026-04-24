import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useImpactPerToken } from "@domain";
import { Icon, Text } from "@components";

import { ImpactItem } from "./ImpactItem";

// Helper function to format numbers with 6 decimal places and comma as decimal separator
function formatNumber(value?: number | string): string {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toFixed(6).replace('.', ',');
}

export function ImpactPerToken() {
  const { t } = useTranslation();
  const { isLoading, area, biodiversity, carbon, trees } = useImpactPerToken();

  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2 mb-1">
        <Icon name="rc" />
        <Text className="text-white">{t('tokenImpact.impactPerToken')}</Text>
      </View>
      <View className="flex-row gap-3 w-full">
        <ImpactItem 
          label={t('common.carbon')}
          value={formatNumber(carbon)}
          suffix="g"
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('common.trees')}
          value={formatNumber(trees)}
          isLoading={isLoading}
        />
      </View>
      <View className="flex-row gap-3 w-full mt-2">
        <ImpactItem 
          label={t('common.biodiversity')}
          value={formatNumber(biodiversity)}
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('common.area')}
          value={formatNumber(area)}
          suffix="m²"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}