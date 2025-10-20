import { ActivityIndicator, FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, FeedItem, Text } from '@components';
import { useNewFeed } from '@domain';
import { FeedItemProps } from '@database';
import { AppStackParamsList } from '@routes';

import { UserWithoutRegister } from './components/UserWithoutRegister';
import { useUserContext } from '@hooks';

type ScreenProps = NativeStackScreenProps<AppStackParamsList, 'HomeScreen'>
export function HomeScreen({ navigation }: ScreenProps) {
  const { list, isLoading } = useNewFeed();
  const { isConnected, userType } = useUserContext();

  function headerList() {
    return (
      <View className='px-3'>
        {isConnected && userType === 0 && (
          <UserWithoutRegister />
        )}

        <TouchableOpacity
          className='w-full h-12 rounded-2xl items-center justify-center flex-row bg-red-500'
          onPress={() => navigation.navigate('ImpactCalculatorScreen')}
        >
          <Text className='text-white'>Impact Calculator</Text>
        </TouchableOpacity>
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
