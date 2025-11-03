import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { InviteRegenerator } from "./Invite/InviteRegenerator";
import { InviteInspector } from "./Invite/InviteInspector";
import { InviteActivist } from "./Invite/InviteActivist";
import { BurnTokens } from "./BurnTokens/BurnTokens";

export function ActivistActions() {
  const { t } = useTranslation();

  return (
    <View>
      <BurnTokens>
        <ActionButton label={t('actions.burnTokens')}/>
      </BurnTokens>
      <InviteRegenerator>
        <ActionButton label={t('actions.inviteRegenerator')}/>
      </InviteRegenerator>
      <InviteInspector>
        <ActionButton label={t('actions.inviteInspector')}/>
      </InviteInspector>
      <InviteActivist>
        <ActionButton label={t('actions.inviteActivist')}/>
      </InviteActivist>
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
