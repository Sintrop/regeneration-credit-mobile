import { TouchableOpacity, View } from "react-native";

import { Avatar, Text, UserTypeText, UserTypeTextType } from "@components";
import { useGetUser, useUserBasicData } from "@domain";

interface Props {
  address: string;
  label: string;
  onPress?: (address: string) => void;
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/** Avatar, name and user type when registered in CommunityRules, otherwise just the address. */
export function UserBadge({ address, label, onPress }: Props) {
  const { userType } = useGetUser({ address });
  const { user } = useUserBasicData({ address, userType });
  const name = user?.name?.trim();

  return (
    <TouchableOpacity className="flex-row items-center gap-3" disabled={!onPress} onPress={() => onPress?.(address)}>
      <Avatar address={address} photoHash={user?.photo || undefined} size={36} />
      <View className="flex-1">
        <Text className="text-gray-400 text-xs">{label}</Text>
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
