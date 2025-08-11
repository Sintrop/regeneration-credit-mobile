/* eslint-disable react-hooks/exhaustive-deps */
import { Text } from 'react-native';
import { Screen } from '@components';
import { useSettingsContext } from '@hooks';


export function HomeScreen() {
  const { rpc } = useSettingsContext();
  
  return (
    <Screen home>
      <Text>Teste</Text>
    </Screen>
  );
}
