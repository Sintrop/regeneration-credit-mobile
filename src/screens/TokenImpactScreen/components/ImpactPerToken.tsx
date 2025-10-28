import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useImpactPerToken } from "@domain";
import { Icon, Text } from "@components";

import { ImpactItem } from "./ImpactItem";

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
          value={Intl.NumberFormat('pt-BR').format(carbon)}
          suffix="g"
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('common.trees')}
          value={Intl.NumberFormat('pt-BR').format(trees)}
          isLoading={isLoading}
        />
      </View>
      <View className="flex-row gap-3 w-full mt-2">
        <ImpactItem 
          label={t('common.biodiversity')}
          value={Intl.NumberFormat('pt-BR').format(biodiversity)}
          isLoading={isLoading}
        />
        <ImpactItem 
          label={t('common.area')}
          value={Intl.NumberFormat('pt-BR').format(area)}
          suffix="m²"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}