import { Image, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { TransferEvent } from "@domain";
import { BaseComponentsProps, Text, UserTypeText, UserTypeTextType } from "@components";
import { AppStackParamsList } from "@routes";

import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useFeedUser } from "../useFeedUser";
import { FeedBadge } from "../FeedBadge";

//@ts-ignore
import RCLogo from "../../../../assets/images/rc.png";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/** RC sent from one person to another (RegenerationCredit.Transfer outside the protocol contracts). */
export function RcTransfer({ additionalData }: BaseComponentsProps) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const transfer = additionalData ? JSON.parse(additionalData) as TransferEvent : null;
  const sender = useFeedUser(transfer?.from);
  const recipient = useFeedUser(transfer?.to);

  if (!transfer) return null;

  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value);
  const recipientRegistered = recipient.userType > 0;

  return (
    <View className="gap-3">
      <HeaderItem
        name={sender.name}
        address={transfer.from}
        createdAt={transfer.blockNumber}
        photo={sender.photo}
        isLoading={sender.isLoading}
      />

      <FeedBadge label={t("feedNews.transferBadge")} tone="teal" />

      <View className="flex-row items-center gap-3">
        <Image source={RCLogo} className="w-9 h-9" resizeMode="contain" />
        <Text className="text-white text-2xl font-bold">{format(transfer.amount)} RC</Text>
      </View>

      <TouchableOpacity
        className="p-3 rounded-xl bg-card-secondary gap-1"
        onPress={() => navigation.navigate("UserDetailsScreen", { address: transfer.to })}
      >
        <Text className="text-gray-400 text-xs">{t("feedNews.transferTo")}</Text>
        <Text className="text-white font-semibold" numberOfLines={1}>
          {recipientRegistered && recipient.name ? recipient.name : shortenAddress(transfer.to)}
        </Text>
        {recipientRegistered && (
          <UserTypeText userType={recipient.userType as UserTypeTextType} className="text-green-primary text-sm" />
        )}
      </TouchableOpacity>
    </View>
  );
}
