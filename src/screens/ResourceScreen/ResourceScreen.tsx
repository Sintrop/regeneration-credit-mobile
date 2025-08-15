import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "@components";
import { AppStackParamsList } from "@routes";
import { Inspection } from "./components/Inspection/Inspection";

const resources = {
  inspection: Inspection
}
export type ResourcesTypes = keyof typeof resources;

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "ResourceScreen">
export function ResourceScreen({ route }: ScreenProps) {
  const { id, resourceType } = route.params;
  const { t } = useTranslation();

  const ResourceComponent = resources[resourceType];
  return (
    <Screen 
      title={t("resourceScreen.title")} 
      showBackButton
      scrollable
    >
      <ResourceComponent id={id} />
    </Screen>
  )
}
