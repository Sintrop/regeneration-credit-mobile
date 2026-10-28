import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Avatar, Text } from "@components";
import { useBlockNumber } from "@domain";
import { useBlocksDuration } from "@hooks";
import { AppStackParamsList } from "@routes";

import { Loading } from "./Loading";

interface Props {
  address?: string;
  name?: string;
  isLoading?: boolean;
  photo?: string;
  /** Block of the event. */
  createdAt?: number;
}

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

/** Author of a feed item: avatar, name and how long ago (with the block). */
export function HeaderItem({ address, name, photo, createdAt, isLoading }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { blockNumber } = useBlockNumber();
  const formatBlocks = useBlocksDuration();

  if (isLoading) return <Loading />;

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const ago = createdAt && blockNumber > createdAt
    ? t("supporterProfile.ago", { duration: formatBlocks(blockNumber - createdAt).split(" (")[0] })
    : "";

  return (
    <TouchableOpacity
      className="flex-row items-center w-full gap-3"
      onPress={() => address && navigation.navigate("UserDetailsScreen", { address })}
    >
      <Avatar address={address ?? ""} photoHash={photo} size={44} />
      <View className="flex-1">
        <Text className="font-bold text-white" numberOfLines={1}>{name?.trim() || short}</Text>
        <Text className="text-gray-400 text-xs" numberOfLines={1}>
          {[ago, createdAt ? `${t("common.block")} ${createdAt}` : ""].filter(Boolean).join(" · ")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
