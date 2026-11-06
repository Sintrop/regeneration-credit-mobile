import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Screen, FeedItem, Text, Actions, Offset } from '@components';
import { useNewFeed } from '@domain';
import { FeedItemProps } from '@database';
import { AppStackParamsList } from '@routes';
import { useSettingsContext, useUserContext } from '@hooks';

import { UserWithoutRegister } from './components/UserWithoutRegister';
import { LoadingFeed } from './components/LoadingFeed';
import { HomeStatusBar } from './components/HomeStatusBar';
import { HomeShortcuts } from './components/HomeShortcuts';
import { UserTimersCard } from './components/UserTimersCard';
import { NewcomerCard } from './components/NewcomerCard';

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'HomeScreen'>
export function HomeScreen(_: ScreenProps) {
  const { list, isLoading, nextPage, atualPage, totalPages, refresh } = useNewFeed();
  const { isConnected, userType } = useUserContext();
  const { rpcUnstable } = useSettingsContext();

  function handleNextPage() {
    if (atualPage < totalPages) {
      nextPage();
    }
  }

  function headerList() {
    return (
      <View className='px-3 -mt-3'>
        <HomeStatusBar />

        {!isConnected && <NewcomerCard />}

        {isConnected && (
          <>
            {userType === 0 && !rpcUnstable && (
              <UserWithoutRegister />
            )}
          </>
        )}

        <HomeShortcuts />

        {isConnected && userType > 0 && <UserTimersCard />}
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
          ListHeaderComponent={headerList()}
          ListEmptyComponent={<EmptyList isLoading={!rpcUnstable} />}
          onEndReachedThreshold={0.5}
          onEndReached={handleNextPage}
          refreshing={isLoading}
          onRefresh={refresh}
        />

        <View className='absolute right-4 bottom-16 gap-5'>
          {userType === 7 && (
            <Offset>
              <OffsetButton />
            </Offset>
          )}
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
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View className='flex-1 w-full h-full'>
        <LoadingFeed />
      </View>
    )
  }

  return (
    <View className='items-center px-8 py-16'>
      <Text className='text-gray-300 text-center'>{t('homeScreen.feedUnavailable')}</Text>
    </View>
  )
}

interface OffsetButtonProps {
  openModal?: () => void;
}
function OffsetButton({ openModal }: OffsetButtonProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={openModal}
      className='flex-row items-center justify-center gap-2 px-5 h-12 rounded-full bg-blue-primary'
    >
      <Text className='font-semibold text-white'>{t('homeScreen.newPubli')}</Text>
    </TouchableOpacity>
  )
}
