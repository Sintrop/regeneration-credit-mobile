import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Avatar, ChainSwitch, Screen, Text, TextInput } from "@components";
import { useUserContext } from "@hooks";
import { useAddSupporter } from "@domain";

export function RegisterScreen() {
  const { address, isConnected } = useUserContext();
  const { t } = useTranslation();
  const userType =7;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { addSupporter } = useAddSupporter()

  function test() {
    addSupporter({
      name,
      description,
      profilePhoto: ''
    })
  }

  if (!isConnected) {
    return (
      <Screen showBackButton title={t('register.title')}>
        <View className="flex-1 w-full h-screen items-center justify-center">
          <Text className="text-white text-center">
            {t('register.youAreNotConnected')}
          </Text>
        </View>
      </Screen>
    )
  }
  return (
    <Screen showBackButton title={t('register.title')}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-3 pt-5"
      >
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
            <Text className="text-gray-300">
              {t('register.selectAnUserType')}
            </Text>

            <View className="flex-row items-center gap-2">
              <Text className="text-white">Supporter</Text>
            </View>
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

          <View className="p-3 rounded-2xl bg-card-primary">
            <TextInput
              label={t('register.description')}
              value={description}
              onChangeText={setDescription}
              className="w-full h-12 rounded-2xl bg-card-secondary text-white px-3"
              placeholder={t('common.typeHere')}
            />
          </View>

          <ChainSwitch />

          <TouchableOpacity
            className="w-full h-12 rounded-2xl items-center justify-center bg-green-primary"
            onPress={test}
          >
            <Text className="text-white font-semibold">{t('register.title')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  )
}