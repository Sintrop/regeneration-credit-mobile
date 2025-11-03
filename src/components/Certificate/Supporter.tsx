import { View } from "react-native";

import { useCertificatedTokens, useGetSupporter, useImpactPerToken } from "@domain";
import { Icon, Text } from "@components";
import { useTranslation } from "react-i18next";

interface Props {
  address: string;
}

export function Supporter({ address }: Props) {
  const { t } = useTranslation();
  const { supporter } = useGetSupporter({ address });
  const { certificated } = useCertificatedTokens({ address });
  const { area, biodiversity, carbon, trees } = useImpactPerToken();

  const carbonImpact = certificated * carbon;
  const treesImpact = certificated * trees;
  const areaImpact = certificated * area;
  const bioImpact = certificated * biodiversity;

  return (
    <View className="w-full max-w-[500] border-2 border-white rounded-2xl p-3 gap-5">
      <View className="flex-row items-center justify-center gap-3 border-b border-card-secondary pb-5 pt-3">
        <Icon name="rc" size={30} />
        <Text className="text-white font-semibold">{t('common.regenerationCredit')}</Text>
      </View>
      <View className="flex-row justify-between">
        <View className="w-[48%]">
          <Text className="text-white font-semibold" numberOfLines={1}>{supporter?.name}</Text>
          <View className="flex-row items-center flex-wrap">
            <Text className="text-white">{t('profile.contributedWith')}</Text>
            <Text className="font-bold text-green-500 mx-1">{Intl.NumberFormat('pt-BR').format(certificated)}</Text>
            <Text className="text-white">RC</Text>
          </View>

          <Text className="text-gray-300 text-xs mt-3">{t('common.impact')}</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-white text-sm">{t('common.carbon')}:</Text>
            <Text className="text-white text-sm font-semibold">
              {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 7}).format(carbonImpact)} g
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-white text-sm">{t('common.trees')}:</Text>
            <Text className="text-white text-sm font-semibold">
              {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 7}).format(treesImpact)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-white text-sm">{t('common.biodiversity')}:</Text>
            <Text className="text-white text-sm font-semibold">
              {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 7}).format(bioImpact)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-white text-sm">{t('common.area')}:</Text>
            <Text className="text-white text-sm font-semibold">
              {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 5}).format(areaImpact)} m²
            </Text>
          </View>
        </View>

        <View className="w-[48%] items-center justify-center">
          <View className="w-40 h-40 bg-red-500"/>
        </View>
      </View>

      <Text className="text-white text-sm text-center my-1">{address}</Text>
    </View>
  )
}
