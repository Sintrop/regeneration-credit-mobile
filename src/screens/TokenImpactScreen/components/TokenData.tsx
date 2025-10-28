import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useTokenData } from "@domain";
import { Text } from "@components";

import { ImpactItem } from "./ImpactItem";

export function TokenData() {
  const { t } = useTranslation();
  const { totalSupply, totalCertified, totalLocked, circulatingSuplly, isLoading } = useTokenData();

  return (
    <View className="gap-1">
      <Text className="text-white">{t('tokenImpact.tokenData')}</Text>
      <View className="flex-row gap-3 w-full">
        <ImpactItem 
          label={t('tokenImpact.totalSupply')}
          value={Intl.NumberFormat('pt-BR').format(totalSupply)}
          suffix="RC"
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('tokenImpact.totalLocked')}
          value={Intl.NumberFormat('pt-BR').format(totalLocked)}
          suffix="RC"
          isLoading={isLoading}
        />
      </View>
      <View className="flex-row gap-3 w-full mt-2">
        <ImpactItem 
          label={t('tokenImpact.totalCertified')}
          value={Intl.NumberFormat('pt-BR').format(totalCertified)}
          suffix="RC"
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('tokenImpact.circulatingSupply')}
          value={Intl.NumberFormat('pt-BR').format(circulatingSuplly)}
          suffix="RC"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}