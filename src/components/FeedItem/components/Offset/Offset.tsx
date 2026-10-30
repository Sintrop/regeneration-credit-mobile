import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { OffsetProps, useGetCalculatorItem, useImpactPerToken, useUserBasicData } from "@domain";
import { BaseComponentsProps, Text } from "@components";
import { AppStackParamsList } from "@routes";
import { formatCarbon } from "@utils";

import { LoadingFeedItem } from "../LoadingFeedItem";
import { HeaderItem } from "../HeaderItem/HeaderItem";
import { FeedBadge } from "../FeedBadge";
import { FeedLink } from "../FeedLink";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

export function Offset({ additionalData }: BaseComponentsProps) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const offset = additionalData ? JSON.parse(additionalData) as OffsetProps : null;
  const { user, isLoading: isLoadingUser } = useUserBasicData({ address: offset?.address, userType: 7 });
  const { item } = useGetCalculatorItem({ itemId: offset?.calculatorItemId ?? 0 });
  const { carbon } = useImpactPerToken();

  if (!offset) return <LoadingFeedItem />;

  const amount = offset.amountBurned / 10 ** 18;
  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);
  const co2Grams = amount * carbon;

  return (
    <View className="gap-3">
      <HeaderItem name={user?.name} address={offset.address} createdAt={offset.blockNumber} photo={user?.photo} isLoading={isLoadingUser} />

      <FeedBadge label={t("feedNews.offsetBadge")} tone="teal" />

      <View className="flex-row items-center gap-3">
        <Image source={RCLogo} className="w-9 h-9" resizeMode="contain" />
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold">{format(amount)} RC</Text>
          {!!item?.item && <Text className="text-gray-300 text-sm">{t("feedNews.offsetItem", { item: item.item })}</Text>}
        </View>
      </View>

      {!!offset.message?.trim() && (
        <View className="pl-3 border-l-2 border-teal-300/60">
          <Text className="text-gray-100 italic leading-6">“{offset.message.trim()}”</Text>
        </View>
      )}

      {co2Grams > 0 && (
        <Text className="text-gray-400 text-sm">{t("feedNews.offsetImpact", { amount: formatCarbon(co2Grams, i18n.language) })}</Text>
      )}

      <FeedLink label={t("feedNews.seeSupporter")} onPress={() => navigation.navigate("UserDetailsScreen", { address: offset.address })} />
    </View>
  );
}
