import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Text } from "@components";
import { UserType, useUserTypesCount } from "@domain";
import { AppStackParamsList } from "@routes";

type NavigationProps = NativeStackNavigationProp<AppStackParamsList, 'CommunityScreen'>
interface Props {
  userType: UserType;
}
export function UserItem({ userType }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const { t } = useTranslation();
  const { count } = useUserTypesCount({ userType })

  function handleGoToUsersList() {
    navigation.navigate('UsersListScreen', { userType });
  }

  return (
    <TouchableOpacity 
      className="p-3 rounded-2xl flex-row justify-between bg-card-primary"
      onPress={handleGoToUsersList}
    >
      <View className="flex-1 max-w-[70%]">
        <Text className="text-white text-2xl font-bold">
          {userType === 1 && t('community.regenerators')}
          {userType === 2 && t('community.inspectors')}
          {userType === 3 && t('community.researchers')}
          {userType === 4 && t('community.developers')}
          {userType === 5 && t('community.contributors')}
          {userType === 6 && t('community.activists')}
          {userType === 7 && t('community.supporters')}
        </Text>
        <Text className="text-white">
          {userType === 1 && t('community.descRegenerators')}
          {userType === 2 && t('community.descInspectors')}
          {userType === 3 && t('community.descResearchers')}
          {userType === 4 && t('community.descDevelopers')}
          {userType === 5 && t('community.descContributors')}
          {userType === 6 && t('community.descActivists')}
          {userType === 7 && t('community.descSupporters')}
        </Text>
      </View>

      <View className="w-28 h-28 bg-card-secondary rounded-2xl items-center justify-center">
        <Text className="font-bold text-green-500 text-5xl">{count}</Text>
        <Text className="text-gray-300 text-center text-sm">
          {t('community.activeUsers')}
        </Text>
      </View>
    </TouchableOpacity>
  )
}