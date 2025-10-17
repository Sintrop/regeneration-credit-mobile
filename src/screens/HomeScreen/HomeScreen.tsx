import { ActivityIndicator, FlatList, ListRenderItemInfo, View } from 'react-native';

import { Screen, FeedItem } from '@components';
import { useNewFeed } from '@domain';
import { FeedItemProps } from '@database';
//import { UserWithoutRegister } from './components/UserWithoutRegister';

export function HomeScreen() {
  const { list, isLoading } = useNewFeed()

  function headerList() {
    return (
      <View className='px-3'>
        {/* <UserWithoutRegister /> */}
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
