import { useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { Profile, Screen, Text } from "@components";
import { AppStackParamsList } from "@routes";
import { useGetUser } from "@domain";

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "UserDetailsScreen">
export function UserDetailsScreen({ route }: ScreenProps) {
  const { address } = route.params;
  const { t } = useTranslation();
  const { userType, isLoading, isError, refetch } = useGetUser({ address })
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);

  if (isLoading) {
    return (
      <Screen title={t("userDetails.title")} isLoading={isLoading} showBackButton >
        <Text>Carregando</Text>
      </Screen>
    )
  }

  if (isError || !userType) {
    return (
      <Screen title={t("userDetails.title")} showBackButton >
        <View className="w-full h-screen items-center justify-center">
          <Text className="text-white font-semibold">{t("userDetails.errorOnGetUser")}</Text>

          <Text
            className="text-white underline mt-5"
            onPress={() => refetch()}
          >
            {t("common.tryAgain")}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen 
      title={t("userDetails.title")} 
      scrollEnabled={scrollEnabled}
      showBackButton 
      scrollable 
      withoutPadding
      isLoading={isLoading} 
    >
      <Profile 
        address={address} 
        userType={userType} 
        changeScrollEnabled={setScrollEnabled}
      />
    </Screen>
  );
}