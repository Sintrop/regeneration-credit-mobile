import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Text, UserBadge } from "@components";
import { useInvitation } from "@domain";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "UserDetailsScreen">;

const ZERO_ADDRESS = /^0x0{40}$/i;

interface Props {
  address: string;
}

/** Who invited this user, with name and role. */
export function Invitation({ address }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProps>();
  const { invitation } = useInvitation({ address });
  const inviter = invitation?.inviter;

  if (!inviter || ZERO_ADDRESS.test(inviter)) return null;

  return (
    <View className="gap-3 p-5 rounded-2xl bg-card-primary">
      <Text className="font-bold text-white text-xl">{t("profile.invitation")}</Text>
      <UserBadge
        address={inviter}
        label={`${t("profile.invitedBy")} · ${t("common.block")} ${invitation?.createdAt ?? ""}`}
        onPress={value => navigation.push("UserDetailsScreen", { address: value })}
      />
    </View>
  );
}
