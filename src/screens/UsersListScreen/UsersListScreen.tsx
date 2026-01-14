import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'UsersListScreen'>;
export function UsersListScreen({ route }: ScreenProps) {
  const { userType } = route.params;
  const { t } = useTranslation();

  return (
    <Screen title={t('usersList.title')} showBackButton>
      <Text>{userType}</Text>
    </Screen>
  )
}
