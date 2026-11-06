import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text, UserBadge, UserTypeText, UserTypeTextType } from "@components";
import { InvitedUser, useGetUser, useInvitedUsers } from "@domain";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "UserDetailsScreen">;

function InvitedRow({ item }: { item: InvitedUser }) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { userType, isLoading } = useGetUser({ address: item.invited });
  const registered = userType > 0;

  return (
    <View className="gap-1 pb-3 border-b border-card-secondary">
      <UserBadge
        address={item.invited}
        label={`${t("common.block")} ${item.blockNumber}`}
        onPress={registered ? address => navigation.push("UserDetailsScreen", { address }) : undefined}
      />
      <View className="flex-row items-center justify-between pl-12">
        <View className="flex-row items-center">
          <Text className="text-gray-400 text-xs">{t("invitedUsers.as")} </Text>
          <UserTypeText userType={item.invitedType as UserTypeTextType} className="text-white text-xs font-semibold" />
        </View>
        {!isLoading && (
          <Text className={`text-xs font-semibold ${registered ? "text-green-primary" : "text-amber-300"}`}>
            {registered ? `✓ ${t("invitedUsers.registered")}` : t("invitedUsers.pending")}
          </Text>
        )}
      </View>
    </View>
  );
}

/** Users invited by this address and whether they already registered. */
export function InvitedUsers({ address }: { address: string }) {
  const { t } = useTranslation();
  const { invited, isLoading } = useInvitedUsers(address);

  return (
    <View className="gap-3 p-5 rounded-2xl bg-card-primary">
      <View className="flex-row items-center justify-between">
        <Text className="font-bold text-white text-xl">{t("invitedUsers.title")}</Text>
        {!isLoading && <Text className="text-gray-400">{invited.length}</Text>}
      </View>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : invited.length === 0 ? (
        <Text className="text-gray-400">{t("invitedUsers.empty")}</Text>
      ) : (
        invited.map(item => <InvitedRow key={`${item.invited}-${item.blockNumber}`} item={item} />)
      )}
    </View>
  );
}
