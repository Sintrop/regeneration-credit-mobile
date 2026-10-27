import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";

import { TreeFundingEvent } from "@domain";
import { BaseComponentsProps, Text } from "@components";

import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useFeedUser } from "../useFeedUser";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";

export function TreeFunding({ additionalData }: BaseComponentsProps) {
  const { t, i18n } = useTranslation();
  const funding = additionalData ? JSON.parse(additionalData) as TreeFundingEvent : null;
  const user = useFeedUser(funding?.account);

  if (!funding) return null;

  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);

  return (
    <View>
      <HeaderItem
        name={user.name}
        address={funding.account}
        createdAt={funding.blockNumber}
        photo={user.photo}
        isLoading={user.isLoading}
      />

      <View className="my-3 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-white">{t("feed.fundedTreePlanting")}</Text>
          <View className="flex-row items-center gap-2">
            <Image source={RCLogo} className="w-7 h-7" resizeMode="contain" />
            <Text className="font-bold text-white">{format(funding.amount)} RC</Text>
          </View>
        </View>
        <Text className="text-gray-300">
          {t("feed.certificateTotal", { amount: format(funding.certifiedTotal) })}
        </Text>
      </View>
    </View>
  );
}
