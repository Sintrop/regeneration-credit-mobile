import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { InviteSupporter } from "./InviteSupporter/InviteSupporter";

export function SupporterActions() {
  const { t } = useTranslation();

  return (
    <View>
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
