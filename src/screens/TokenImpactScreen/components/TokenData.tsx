import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useTokenData } from "@domain";
import { Text } from "@components";

import { ImpactItem } from "./ImpactItem";

// Helper to format as whole number with dot for thousands (1.000.000)
function formatWholeNumber(value?: number): string {
  if (value === undefined || value === null) return '0';
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function TokenData() {
  const { t } = useTranslation();
  const { totalSupply, totalCertified, totalLocked, circulatingSuplly, isLoading } = useTokenData();

  return (
    <View className="gap-1">
      <Text className="text-white">{t('tokenImpact.tokenData')}</Text>
      <View className="flex-row gap-3 w-full">
        <ImpactItem 
          label={t('tokenImpact.totalSupply')}
          value={formatWholeNumber(totalSupply)}
          suffix="RC"
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('tokenImpact.totalLocked')}
          value={formatWholeNumber(totalLocked)}
          suffix="RC"
          isLoading={isLoading}
        />
      </View>
      <View className="flex-row gap-3 w-full mt-2">
        <ImpactItem 
          label={t('tokenImpact.totalCertified')}
          value={formatWholeNumber(totalCertified)}
          suffix="RC"
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('tokenImpact.circulatingSupply')}
          value={formatWholeNumber(circulatingSuplly)}
          suffix="RC"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}