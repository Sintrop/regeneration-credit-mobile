/* eslint-disable react-hooks/exhaustive-deps */
import { Text } from 'react-native';
import { Screen } from '@components';
import { useSettingsContext } from '@hooks';
import { useFeedInspections } from '@domain';


export function HomeScreen() {
  const { rpc } = useSettingsContext();
  const { idsPage } = useFeedInspections({ rpc, itemsPerPage: 10 });
  
  return (
    <Screen home>
      {idsPage.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </Screen>
  );
}
