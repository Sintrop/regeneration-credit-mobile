import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useImpactPerToken } from "@domain";
import { Icon, Text } from "@components";
import { formatArea } from "@utils";

import { ImpactItem } from "./ImpactItem";

export function ImpactPerToken() {
  const { t, i18n } = useTranslation();
  const formatNumber = (value: number) => Intl.NumberFormat(i18n.language, { maximumSignificantDigits: 4 }).format(value || 0);
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
          value={formatArea(area, i18n.language)}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}