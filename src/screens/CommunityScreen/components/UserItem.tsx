import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Text, UserTypeText, UserTypeTextType } from "@components";
import { UserType, usePoolOverview, useUserTypesCount } from "@domain";
import { AppStackParamsList } from "@routes";
import { checkVacancies } from "@services";

import { INVITED_BY, TYPE_COLOR } from "../communityRules";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, "CommunityScreen">;

const NAME_KEY: Record<number, string> = {
  1: "community.regenerators", 2: "community.inspectors", 3: "community.researchers", 4: "community.developers",
  5: "community.contributors", 6: "community.activists", 7: "community.supporters",
};
const DESCRIPTION_KEY: Record<number, string> = {
  1: "community.descRegenerators", 2: "community.descInspectors", 3: "community.descResearchers", 4: "community.descDevelopers",
  5: "community.descContributors", 6: "community.descActivists", 7: "community.descSupporters",
};

interface Props {
  userType: UserType;
  regeneratorsCount: number;
}

export function UserItem({ userType, regeneratorsCount }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const { t, i18n } = useTranslation();
  const { count } = useUserTypesCount({ userType });
  const hasPool = userType >= 1 && userType <= 6;
  const { overview } = usePoolOverview(hasPool ? userType : 1);

  // Same rule as CommunityRules._registrationProportionalityAllowed (types without a limit report no number)
  const vacancies = checkVacancies({ userType, regeneratorsCount, userTypeCount: count });
  const limited = [2, 3, 4, 5, 6].includes(userType);
  const invitedBy = INVITED_BY[userType];
  const format = (value: number) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(value);

  return (
    <TouchableOpacity
      className="p-4 rounded-2xl bg-card-primary gap-3"
      onPress={() => navigation.navigate("UsersListScreen", { userType })}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-2 flex-1">
          <View className={`w-3 h-3 rounded-full ${TYPE_COLOR[userType]}`} />
          <Text className="text-white text-lg font-bold">{t(NAME_KEY[userType])}</Text>
        </View>
        <View className="items-end">
          <Text className="text-white text-2xl font-bold">{count}</Text>
          <Text className="text-gray-400 text-[11px]">{t("community.activeUsers")}</Text>
        </View>
      </View>

      <Text className="text-gray-300 text-sm" numberOfLines={3}>{t(DESCRIPTION_KEY[userType])}</Text>

      <View className="flex-row flex-wrap gap-2">
        {limited ? (
          <Chip
            text={vacancies.availableVacancie ? t("community.vacancies", { count: vacancies.ammount }) : t("community.noVacancies")}
            tone={vacancies.availableVacancie ? "good" : "muted"}
          />
        ) : (
          // RegeneratorRules.MAX_ACTIVE_REGENERATORS = 500,000; supporters have no limit
          <Chip text={userType === 1 ? t("community.regeneratorCap") : t("community.unlimited")} tone="good" />
        )}
        {invitedBy === 0 ? (
          <Chip text={t("community.openRegistration")} tone="neutral" />
        ) : (
          <View className="flex-row items-center px-3 py-1 rounded-full bg-card-secondary">
            <Text className="text-gray-300 text-xs">{t("community.invitedBy")} </Text>
            <UserTypeText userType={invitedBy as UserTypeTextType} className="text-white text-xs font-semibold" />
          </View>
        )}
        {hasPool && overview && (
          <Chip text={t("community.poolPerEra", { tokens: format(overview.tokensPerEra) })} tone="neutral" />
        )}
      </View>

      <Text className="text-green-primary text-sm font-semibold">{t("community.seeMembers")} ›</Text>
    </TouchableOpacity>
  );
}

function Chip({ text, tone }: { text: string; tone: "good" | "muted" | "neutral" }) {
  const style = tone === "good" ? "bg-green-primary/15 text-green-primary" : tone === "muted" ? "bg-red-400/10 text-red-300" : "bg-card-secondary text-gray-200";
  return <Text className={`text-xs font-semibold px-3 py-1 rounded-full overflow-hidden ${style}`}>{text}</Text>;
}
