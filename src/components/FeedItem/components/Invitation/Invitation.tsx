import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { InvitationEvent } from "@domain";
import { BaseComponentsProps, Text, UserTypeText, UserTypeTextType } from "@components";
import { AppStackParamsList } from "@routes";

import { HeaderItem } from "../HeaderItem/HeaderItem";
import { useFeedUser } from "../useFeedUser";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "HomeScreen">;

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function Invitation({ additionalData }: BaseComponentsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const invitation = additionalData ? JSON.parse(additionalData) as InvitationEvent : null;
  const inviter = useFeedUser(invitation?.inviter);
  const invited = useFeedUser(invitation?.invited);

  if (!invitation) return null;

  const registered = invited.userType > 0;

  return (
    <View>
      <HeaderItem
        name={inviter.name}
        address={invitation.inviter}
        createdAt={invitation.blockNumber}
        photo={inviter.photo}
        isLoading={inviter.isLoading}
      />

      <View className="my-3 gap-3">
        <Text className="font-bold text-white">{t("feed.invitationSent")}</Text>
        <Text className="text-white">
          {t("feed.invitedToBe")}{" "}
          <UserTypeText userType={invitation.invitedType as UserTypeTextType} className="text-green-primary font-semibold" />
        </Text>

        <TouchableOpacity
          className="p-3 rounded-xl bg-card-secondary gap-1"
          disabled={!registered}
          onPress={() => navigation.navigate("UserDetailsScreen", { address: invitation.invited })}
        >
          <Text className="text-white font-semibold" numberOfLines={1}>
            {registered && invited.name ? invited.name : shortenAddress(invitation.invited)}
          </Text>
          {invited.isLoading ? (
            <Text className="text-gray-400 text-sm">{t("common.loading")}</Text>
          ) : registered ? (
            <Text className="text-green-primary text-sm font-semibold">✓ {t("feed.invitationAccepted")}</Text>
          ) : (
            <Text className="text-amber-300 text-sm font-semibold">{t("feed.invitationPending")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
