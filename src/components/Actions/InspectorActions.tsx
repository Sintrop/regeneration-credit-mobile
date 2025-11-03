import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionItem } from "@components";

import { RealizeInspection } from "./RealizeInspection/RealizeInspection";
import { AcceptInspection } from "./AcceptInspection/AcceptInspection";
import { BurnTokens } from "./BurnTokens/BurnTokens";

export function InspectorActions() {
  const { t } = useTranslation();

  return (
    <View>
      <BurnTokens>
        <ActionButton label={t('actions.burnTokens')}/>
      </BurnTokens>
      <AcceptInspection>
        <ActionButton label={t('actions.acceptInspection')}/>
      </AcceptInspection>
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
