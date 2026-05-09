import { View } from "react-native";
import { useTranslation } from "react-i18next";
import QRCode from 'react-native-qrcode-svg';

import { useCertificatedTokens, useGetSupporter, useImpactPerToken } from "@domain";
import { Icon, Text } from "@components";

//@ts-ignore
import RCLogo from "../../assets/images/rc.png";
import { DownloadContainer } from "./DownloadContainer";

interface Props {
  address: string;
}

// Helper to format numbers with 5 decimal places using comma as decimal separator
function formatImpact(value: number): string {
  return value.toFixed(5).replace('.', ',');
}

// Helper to format whole numbers with dot for thousands
function formatWhole(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function Supporter({ address }: Props) {
  const { t } = useTranslation();
  const { supporter } = useGetSupporter({ address });
  const { certificated } = useCertificatedTokens({ address });
  const { area, biodiversity, carbon, trees } = useImpactPerToken();

  // Calculate impacts
  const carbonImpact = certificated * carbon;
  const treesImpact = certificated * trees;
  const areaImpact = certificated * area;
  const bioImpact = certificated * biodiversity;

  // Carbon in tonnes (g -> tonnes: divide by 1e6)
  const carbonTonnes = carbonImpact / 1e6;

  const parsedName = supporter?.name.replaceAll(' ', '-').toLowerCase();
  const qrLink = 'https://users.regenerationcredit.org/supporter/' + address + '/' + parsedName;

  return (
    <DownloadContainer>
      <View className="w-full max-w-[500] border-2 border-white rounded-2xl p-3 gap-5 bg-card-primary">
        <View className="flex-row items-center justify-center gap-3 border-b border-card-secondary pb-5 pt-3">
          <Icon name="rc" size={30} />
          <Text className="text-white font-semibold">{t('common.regenerationCredit')}</Text>
        </View>
        <View className="flex-row justify-between">
          <View className="w-[48%]">
            <Text className="text-white font-semibold" numberOfLines={1}>{supporter?.name}</Text>
            <View className="flex-row items-center flex-wrap">
              <Text className="text-white">{t('profile.contributedWith')}</Text>
              <Text className="font-bold text-green-500 mx-1">{formatWhole(certificated)}</Text>
              <Text className="text-white">RC</Text>
            </View>

            <Text className="text-gray-300 text-xs mt-3">Financiando o impacto de:</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('common.carbon')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {formatImpact(carbonTonnes)} t
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('common.trees')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {formatImpact(treesImpact)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('common.biodiversity')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {formatImpact(bioImpact)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm">{t('common.area')}:</Text>
              <Text className="text-white text-sm font-semibold">
                {formatImpact(areaImpact)} m²
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
