import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { RequestInspection } from "./RequestInspection/RequestInspection";

export function RegeneratorActions() {
  const { t } = useTranslation();

  return (
    <View>
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
