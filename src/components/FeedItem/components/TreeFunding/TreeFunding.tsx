import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";

import { TreeFundingEvent, useImpactPerToken } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useFeedUser } from "../useFeedUser";
import { FeedBadge } from "../FeedBadge";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";

export function TreeFunding({ additionalData }: BaseComponentsProps) {
  const { t, i18n } = useTranslation();
  const funding = additionalData ? JSON.parse(additionalData) as TreeFundingEvent : null;
  const user = useFeedUser(funding?.account);
  const { trees } = useImpactPerToken();

  if (!funding) return null;

  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);

  return (
    <View className="gap-3">
      <HeaderItem
        name={user.name}
        address={funding.account}
        createdAt={funding.blockNumber}
        photo={user.photo}
        isLoading={user.isLoading}
      />

      <FeedBadge label={t("feedNews.treeFundingBadge")} tone="green" />

      <View className="flex-row items-center gap-3">
        <Image source={RCLogo} className="w-9 h-9" resizeMode="contain" />
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold">{format(funding.amount)} RC</Text>
          {trees > 0 && <Text className="text-gray-300 text-sm">{t("feedNews.treesFunded", { trees: format(funding.amount * trees) })}</Text>}
        </View>
      </View>

      <Text className="text-gray-400 text-sm">{t("feed.certificateTotal", { amount: format(funding.certifiedTotal) })}</Text>
    </View>
  );
}
