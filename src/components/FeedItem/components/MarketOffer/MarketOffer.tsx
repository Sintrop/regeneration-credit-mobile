import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { MarketOfferEvent } from "@domain";
import { BaseComponentsProps, Text } from "@components";
import { AppStackParamsList } from "@routes";

import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useFeedUser } from "../useFeedUser";
import { formatOfferPrice } from "../../../../screens/MarketScreen/formatOfferPrice";
import { FeedBadge } from "../FeedBadge";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

export function MarketOffer({ additionalData }: BaseComponentsProps) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const offer = additionalData ? JSON.parse(additionalData) as MarketOfferEvent : null;
  const seller = useFeedUser(offer?.seller);

  if (!offer) return null;

  return (
    <View className="gap-3">
      <HeaderItem
        name={seller.name}
        address={offer.seller}
        createdAt={offer.blockNumber}
        photo={seller.photo}
        isLoading={seller.isLoading}
      />

      <View className="gap-3">
        <FeedBadge label={`${t("feedNews.marketBadge")} · ${t("market.offer", { id: offer.offerId })}`} tone="amber" />
        <View className="flex-row items-end justify-between p-3 rounded-xl bg-card-secondary">
          <View>
            <Text className="text-gray-400 text-xs">{t("market.amount")}</Text>
            <Text className="text-white text-xl font-bold">{Intl.NumberFormat(i18n.language).format(offer.amountRC)} RC</Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-xs">{t("market.unitPrice")}</Text>
            <Text className="text-green-primary text-lg font-bold">{formatOfferPrice(offer.unitPrice, i18n.language)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("MarketScreen")}>
          <Text className="text-green-primary font-semibold">{t("feed.seeOnMarket")} ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
