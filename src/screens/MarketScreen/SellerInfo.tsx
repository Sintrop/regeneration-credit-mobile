import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Avatar, Text, UserTypeText, UserTypeTextType } from "@components";
import { useGetUser, useUserBasicData } from "@domain";

interface Props {
  address: string;
  onPress: (address: string) => void;
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/** Seller avatar and name when registered in CommunityRules, otherwise just the address. */
export function SellerInfo({ address, onPress }: Props) {
  const { t } = useTranslation();
  const { userType } = useGetUser({ address });
  const { user } = useUserBasicData({ address, userType });
  const name = user?.name?.trim();

  return (
    <TouchableOpacity className="flex-row items-center gap-3" onPress={() => onPress(address)}>
      <Avatar address={address} photoHash={user?.photo || undefined} size={36} />
      <View className="flex-1">
        <Text className="text-gray-400 text-xs">{t('market.seller')}</Text>
        {name ? (
          <>
            <Text className="text-white font-semibold" numberOfLines={1}>{name}</Text>
            <View className="flex-row items-center gap-1">
              <UserTypeText userType={userType as UserTypeTextType} className="text-green-primary text-xs" />
              <Text className="text-gray-400 text-xs">• {shortenAddress(address)}</Text>
            </View>
          </>
        ) : (
          <Text className="text-green-primary font-semibold underline">{shortenAddress(address)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
