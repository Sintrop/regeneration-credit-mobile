import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { InviteSupporter } from "./Invite/InviteSupporter";
import { BurnTokens } from "./BurnTokens/BurnTokens";

export function SupporterActions() {
  const { t } = useTranslation();

  return (
    <View>
      <BurnTokens>
        <ActionButton label={t('actions.burnTokens')}/>
      </BurnTokens>
      <InviteSupporter>
        <ActionButton label={t('actions.inviteSupporter')}/>
      </InviteSupporter>
    </View>
  )
}

interface ActionButtonProps {
  openModal?: () => void;
  label: string;
}
function ActionButton({ openModal, label }: ActionButtonProps) {
  return (
    <ActionItem label={label} onPress={openModal} />
  )
}
