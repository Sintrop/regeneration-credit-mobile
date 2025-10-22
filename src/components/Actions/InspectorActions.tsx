import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { RealizeInspection } from "./RealizeInspection/RealizeInspection";

export function InspectorActions() {
  const { t } = useTranslation();

  return (
    <View>
      <RealizeInspection>
        <ActionButton label={t('actions.realizeInspection')}/>
      </RealizeInspection>
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
