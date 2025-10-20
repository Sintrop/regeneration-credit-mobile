import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Avatar, Screen, Select, Text, TextInput } from "@components";
import { useUserContext } from "@hooks";
import { RegistrationsType, UserRegistration } from "./components/UserRegistration/UserRegistration";

export function RegisterScreen() {
  const { address, isConnected } = useUserContext();
  const { t } = useTranslation();
  const [userType, setUserType] = useState(0);
  const [name, setName] = useState("");

  if (!isConnected) {
    return (
      <Screen showBackButton title={t('register.title')}>
        <View className="flex-1 w-full h-screen items-center justify-center">
          <Text className="text-white text-center">
            {t('common.youAreNotConnected')}
          </Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen showBackButton title={t('register.title')} scrollable>
      <View className="gap-5">
        <View className="gap-2 p-3 rounded-2xl bg-card-primary">
          <Text className="text-gray-300">
            {t('register.walletConnected')}
          </Text>

          <View className="flex-row items-center gap-2">
            <Avatar address={address} size={25}/>
            <Text className="text-white" numberOfLines={1}>{address}</Text>
          </View>
        </View>

        <View className="gap-2 p-3 rounded-2xl bg-card-primary">
          <Select
            onChange={setUserType}
            value={userType}
            label={t('register.selectAnOption')}
            options={[
              {value: 0, label: t('register.touchToSelect'), default: true},
              // {value: 1, label: t('common.regenerator')},
              {value: 2, label: t('common.inspector')},
              // {value: 3, label: t('common.researcher')},
              // {value: 4, label: t('common.developer')},
              // {value: 5, label: t('common.contributor')},
              // {value: 6, label: t('common.activist')},
              {value: 7, label: t('common.supporter')},
            ]}
          />
        </View>

        <View className="p-3 rounded-2xl bg-card-primary">
          <TextInput
            label={t('register.name')}
            value={name}
            onChangeText={setName}
            className="w-full h-12 rounded-2xl bg-card-secondary text-white px-3"
            placeholder={t('common.typeHere')}
          />
        </View>

        {userType !== 0 && (
          <UserRegistration userType={userType as RegistrationsType} name={name} />
        )}
      </View>
    </Screen>
  )
}