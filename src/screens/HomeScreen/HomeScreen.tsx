import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Screen, FeedItem, Text, Icon, Actions } from '@components';
import { useNewFeed } from '@domain';
import { FeedItemProps } from '@database';
import { AppStackParamsList } from '@routes';
import { useUserContext } from '@hooks';

import { UserWithoutRegister } from './components/UserWithoutRegister';
import { LoadingFeed } from './components/LoadingFeed';

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'HomeScreen'>
export function HomeScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();
  const { list, isLoading, nextPage, atualPage, totalPages, refresh } = useNewFeed();
  const { isConnected, userType } = useUserContext();

  function handleNextPage() {
    if (atualPage < totalPages){
      nextPage();
    }
  }

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

        <View className='flex-row justify-center gap-4'>
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
        <View className='flex-row justify-center gap-4 mt-2'>
          <TouchableOpacity
            className='flex-1 h-12 rounded-2xl items-center justify-center flex-row gap-3 bg-card-primary'
            onPress={() => navigation.navigate('TokenImpactScreen')}
          >
            <Icon name="rcStats" size={20} />
            <Text className='text-white'>{t('tokenImpact.title')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 h-12 rounded-2xl items-center justify-center flex-row gap-3 bg-card-primary'
            onPress={() => navigation.navigate('CommunityScreen')}
          >
            <Icon name="community" size={20} />
            <Text className='text-white'>{t('community.title')}</Text>
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
    <Screen home scrollEnabled={list.length > 0} >
      <View className='relative flex-1'>
        <FlatList
          data={list}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItemFeed}
          contentContainerClassName="pt-3 gap-3 pb-10"
          ListHeaderComponent={headerList}
          ListEmptyComponent={<EmptyList isLoading={true}/>}
          onEndReachedThreshold={0.5}
          onEndReached={handleNextPage}
          refreshing={isLoading}
          onRefresh={refresh}
        />

        <View className='absolute right-4 bottom-16'>
          {isConnected && userType !== 0 && (
            <Actions />
          )}
          {/* <Actions /> */}
        </View>
      </View>
    </Screen>
  );
}

interface EmptyListProps {
  isLoading: boolean
}
function EmptyList({ isLoading }: EmptyListProps) {
  if (isLoading) {
    return (
      <View className='flex-1 w-full h-full'>
        <LoadingFeed />
      </View>
    )
  }

  return <View />
}
