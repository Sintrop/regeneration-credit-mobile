/* eslint-disable react-hooks/exhaustive-deps */
import { Screen, FeedItem } from '@components';
import { useFeedInspections } from '@domain';
import { View } from 'react-native';


export function HomeScreen() {
  const { idsPage,  } = useFeedInspections({ itemsPerPage: 10 });
  
  return (
    <Screen home>
      <View className='gap-5'>
        {idsPage.map((item, index) => (
          <FeedItem type='inspection' id={item} key={index} />
        ))}
      </View>
    </Screen>
  );
}
