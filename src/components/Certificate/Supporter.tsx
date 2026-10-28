import { View } from "react-native";
import { useTranslation } from "react-i18next";
import QRCode from 'react-native-qrcode-svg';

import { useCertificatedTokens, useGetSupporter, useImpactPerToken } from "@domain";
import { Icon, Text } from "@components";

//@ts-ignore
import RCLogo from "../../assets/images/rc.png";
import { DownloadContainer } from "./DownloadContainer";
import { formatArea } from "@utils";

interface Props {
  address: string;
}


export function Supporter({ address }: Props) {
  const { t, i18n } = useTranslation();
  const formatImpact = (value: number) => Intl.NumberFormat(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  const formatWhole = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);
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

  const parsedName = supporter?.name?.replaceAll(' ', '-').toLowerCase() ?? '';
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

            <Text className="text-gray-300 text-xs mt-3">{t('common.fundingImpactOf')}</Text>
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
                {formatArea(areaImpact, i18n.language)}
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
