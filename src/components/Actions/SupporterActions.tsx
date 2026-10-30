import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { InviteSupporter } from "./Invite/InviteSupporter";
import { Offset } from "./Offset/Offset";
import { BurnTokens } from "./BurnTokens/BurnTokens";

export function SupporterActions() {
  const { t } = useTranslation();

  return (
    <View>
      <Offset>
        <ActionButton label={t('offset.newOffset')} hint={t('offset.newOffsetHint')} />
      </Offset>
      <BurnTokens>
        <ActionButton label={t('actions.burnTokens')}/>
      </BurnTokens>
      <InviteSupporter>
        <ActionButton label={t('actions.inviteSupporter')} hint={t('actions.inviteSupporterHint')} />
      </InviteSupporter>
    </View>
  )
}

interface ActionButtonProps {
  openModal?: () => void;
  label: string;
  hint?: string;
}
function ActionButton({ openModal, label, hint }: ActionButtonProps) {
  return (
    <ActionItem label={label} hint={hint} onPress={openModal} />
  )
}
