import { ActivityIndicator, FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, FeedItem, Text, Icon } from '@components';
import { useNewFeed } from '@domain';
import { FeedItemProps } from '@database';
import { AppStackParamsList } from '@routes';

import { UserWithoutRegister } from './components/UserWithoutRegister';
import { useUserContext } from '@hooks';
import { useTranslation } from 'react-i18next';

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'HomeScreen'>
export function HomeScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();
  const { list, isLoading } = useNewFeed();
  const { isConnected, userType } = useUserContext();

  function headerList() {
    return (
      <View className='px-3'>
        {isConnected && (
          <>
            {userType === 0 && (
              <UserWithoutRegister />
            )}
          </>
        )}

        {/* <UserWithoutRegister /> */}

        <View className='flex-row justify-center/ gap-4'>
          <TouchableOpacity
            className='w-[48%] h-12 rounded-2xl items-center justify-center flex-row gap-3 bg-card-primary'
            onPress={() => navigation.navigate('ImpactCalculatorScreen')}
          >
            <Icon name="impactCalculator" size={20} />
            <Text className='text-white'>{t('impactCalculator.title')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='w-[48%] h-12 rounded-2xl items-center justify-center flex-row gap-3 bg-card-primary'
            onPress={() => navigation.navigate('MyTokensScreen')}
          >
            <Icon name="tokens" size={20} />
            <Text className='text-white'>{t('myTokens.title')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function renderItemFeed({ item }: ListRenderItemInfo<FeedItemProps>) {
    return (
      <FeedItem 
        key={item.id} 
        id={item.resourceId} 
        type={item.resourceType} 
        additionalData={item?.additionalData} 
      />
    )
  }

  return (
    <Screen home>
      <FlatList
        data={list}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItemFeed}
        contentContainerClassName="pt-3 gap-3 pb-10"
        ListHeaderComponent={headerList}
        ListEmptyComponent={<EmptyList isLoading={isLoading}/>}
      />
    </Screen>
  );
}

interface EmptyListProps {
  isLoading: boolean
}
function EmptyList({}: EmptyListProps) {
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size={50} />
    </View>
  )
}
