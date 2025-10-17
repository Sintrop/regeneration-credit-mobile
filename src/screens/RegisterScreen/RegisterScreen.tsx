import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Avatar, ChainSwitch, Screen, Select, Text, TextInput } from "@components";
import { useUserContext } from "@hooks";
import { useAddSupporter } from "@domain";
import { ProofPhoto } from "./components/ProofPhoto";

export function RegisterScreen() {
  const { address, isConnected } = useUserContext();
  const { t } = useTranslation();
  const [userType, setUserType] = useState(0);
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

  if (isConnected) {
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
              {value: 4, label: t('common.developer')},
              {value: 2, label: t('common.inspector')},
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

        <View className="p-3 rounded-2xl bg-card-primary">
          <TextInput
            label={t('register.description')}
            value={description}
            onChangeText={setDescription}
            className="w-full h-12 rounded-2xl bg-card-secondary text-white px-3"
            placeholder={t('common.typeHere')}
          />
        </View>

        <ProofPhoto />

        <ChainSwitch />

        <TouchableOpacity
          className="w-full h-12 rounded-2xl items-center justify-center bg-green-primary"
          onPress={test}
        >
          <Text className="text-white font-semibold">{t('register.title')}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}