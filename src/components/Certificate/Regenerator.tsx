import { View } from "react-native";
import { useTranslation } from "react-i18next";
import QRCode from 'react-native-qrcode-svg';

import { useGetRegenerator, useUserInspections } from "@domain";
import { Icon, Text } from "@components";

import { DownloadContainer } from "./DownloadContainer";
//@ts-ignore
import RCLogo from "../../assets/images/rc.png";

interface Props {
  address: string;
}

export function Regenerator({ address }: Props) {
  const { t } = useTranslation();
  const { regenerator } = useGetRegenerator({ address });
  const { treesAverage, bioAverage } = useUserInspections({ address });

  const parsedName = regenerator?.name.replaceAll(' ', '-').toLowerCase();
  const qrLink = 'https://users.regenerationcredit.org/regenerator/' + address + '/' + parsedName;

  return (
    <DownloadContainer>
      <View className="w-full max-w-[500] border-2 border-white rounded-2xl p-3 gap-5 bg-card-primary">
        <View className="flex-row items-center justify-center gap-3 border-b border-card-secondary pb-5 pt-3">
          <Icon name="rc" size={30} />
          <Text className="text-white font-semibold">{t('common.regenerationCredit')}</Text>
        </View>
        <View className="flex-row justify-between">
          <View className="w-[48%]">
            <Text className="text-white font-semibold" numberOfLines={1}>{regenerator?.name}</Text>
            <View className="flex-row items-center flex-wrap">
              <Text className="text-white">{t('profile.regenerationScore')}</Text>
              <Text className="font-bold text-green-500 mx-1 text-xl">
                {Intl.NumberFormat('pt-BR').format(regenerator?.regenerationScore?.score ?? 0)}
              </Text>
            </View>

            <Text className="text-gray-300 text-xs mt-3">{t('common.data')}</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('profile.totalInspections')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {Intl.NumberFormat('pt-BR').format(regenerator?.totalInspections ?? 0)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('profile.totalArea')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {Intl.NumberFormat('pt-BR').format(regenerator?.totalArea ?? 0)} m²
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('common.trees')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {Intl.NumberFormat('pt-BR').format(treesAverage)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('common.biodiversity')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {Intl.NumberFormat('pt-BR').format(bioAverage)}
              </Text>
            </View>
          </View>

          <View className="w-[48%] items-center justify-center">
            <QRCode
              value={qrLink}
              size={130}
              logo={RCLogo}
              logoSize={30}
              logoBorderRadius={30}
            />
          </View>
        </View>

        <Text className="text-white text-sm text-center my-1">{address}</Text>
      </View>
    </DownloadContainer>
  )
}
