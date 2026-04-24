import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useTotalImpact } from "@domain";
import { Icon, Text } from "@components";

import { ImpactItem } from "./ImpactItem";

// Helper function to format numbers with comma as decimal separator
function formatNumber(value?: number | string): string {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  // Use Intl.NumberFormat with pt-BR for comma as decimal separator
  return new Intl.NumberFormat('pt-BR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(num);
}

export function TotalImpact() {
  const { t } = useTranslation();
  const { isLoading, area, biodiversity, carbon, trees } = useTotalImpact();

  // Convert carbon from g to tonnes (g -> kg -> t)
  const carbonTonnes = carbon / 1000000;
  // Convert area from m² to hectares (1 ha = 10000 m²)
  const areaHa = area / 10000;
  // Trees should be whole numbers only, with dot for thousands
  const treesWhole = Math.round(trees).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2 mb-1">
        <Icon name="rc" />
        <Text className="text-white">{t('tokenImpact.totalImpact')}</Text>
      </View>
      <View className="flex-row gap-3 w-full">
        <ImpactItem 
          label={t('common.carbon')}
          value={formatNumber(carbonTonnes)}
          suffix="t"
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('common.trees')}
          value={treesWhole}
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
          value={formatNumber(areaHa)}
          suffix="ha"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}