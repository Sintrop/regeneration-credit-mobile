import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useSupporterCompensations } from "@domain";
import { BurnTokens, Certificate, Text } from "@components";
import { useUserContext } from "@hooks";

import { HeaderProfile } from "../HeaderProfile/HeaderProfile";
import { CompensationsList, ImpactSummary } from "../Supporter/Supporter";
import { TransferModal } from "../../../../screens/MyTokensScreen/components/TransferModal";

interface Props {
  address: string;
}

/**
 * Wallet without registration. Its only actions are token transfers and burning RC
 * directly in the token contract (offsetting through SupporterRules needs a supporter),
 * and those burns still count for the impact summary, certificate and compensation list.
 */
export function Anonymous({ address }: Props) {
  const { t } = useTranslation();
  const { address: connectedAddress } = useUserContext();
  const { compensations, isLoading } = useSupporterCompensations(address);
  const [showTransfer, setShowTransfer] = useState(false);
  const isOwnProfile = !!connectedAddress && connectedAddress.toLowerCase() === address.toLowerCase();

  return (
    <View className="gap-3">
      <HeaderProfile address={address} name={t("common.anonymous")} photoHash="" userType={0} />

      <View className="gap-3 px-2">
        <View className="gap-3 p-5 rounded-2xl bg-card-primary">
          <Text className="text-gray-300 text-sm">{t("anonymousProfile.description")}</Text>
          {isOwnProfile && (
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                className="h-10 px-4 rounded-xl items-center justify-center border border-green-primary"
                onPress={() => setShowTransfer(true)}
              >
                <Text className="text-green-primary font-semibold">{t("myTokens.transfer")}</Text>
              </TouchableOpacity>
              <BurnTokens>
                <BurnButton label={t("anonymousProfile.burn")} />
              </BurnTokens>
            </View>
          )}
        </View>

        <ImpactSummary address={address} compensationsCount={compensations.length} />

        <View className="gap-2 p-5 rounded-2xl bg-card-primary">
          <Text className="font-bold text-white text-xl">{t("profile.certificates")}</Text>
          <Text className="text-gray-300 text-sm">{t("anonymousProfile.certificateHint")}</Text>
          <Certificate address={address} type="supporter" />
        </View>

        <CompensationsList compensations={compensations} isLoading={isLoading} />
      </View>

      {isOwnProfile && (
        <TransferModal visible={showTransfer} onClose={() => setShowTransfer(false)} />
      )}
    </View>
  );
}

function BurnButton({ label, openModal }: { label: string; openModal?: () => void }) {
  return (
    <TouchableOpacity
      className="h-10 px-4 rounded-xl items-center justify-center bg-green-primary"
      onPress={openModal}
    >
      <Text className="text-green-secondary font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}
