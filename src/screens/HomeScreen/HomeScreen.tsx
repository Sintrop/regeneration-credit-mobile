/* eslint-disable react-hooks/exhaustive-deps */
import { FlatList, ListRenderItemInfo } from 'react-native';

import { Screen, FeedItem } from '@components';
import { useFeedInspections } from '@domain';


export function HomeScreen() {
  const { idsPage } = useFeedInspections({ itemsPerPage: 10 });
  
  function renderItemFeed({ item, index }: ListRenderItemInfo<number>) {
    return (
      <FeedItem key={index} id={item} type="inspection" />
    )
  }
  return (
    <Screen home>
      <FlatList
        data={idsPage}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItemFeed}
        contentContainerClassName="pt-3 gap-3 pb-10"
      />
    </Screen>
  );
}
