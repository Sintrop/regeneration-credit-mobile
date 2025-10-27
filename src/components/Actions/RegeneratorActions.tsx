import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { RequestInspection } from "./RequestInspection/RequestInspection";
import { BurnTokens } from "./BurnTokens/BurnTokens";

export function RegeneratorActions() {
  const { t } = useTranslation();

  return (
    <View>
      <BurnTokens>
        <ActionButton label={t('actions.burnTokens')}/>
      </BurnTokens>
      <RequestInspection>
        <ActionButton label={t('actions.requestInspection')}/>
      </RequestInspection>
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
