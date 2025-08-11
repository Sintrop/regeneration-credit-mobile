import { useEffect } from 'react';
import { Alert, Button, Text } from 'react-native';
import { useSDK } from '@metamask/sdk-react';
import { Screen } from '@components';
import { useTranslation } from 'react-i18next';
import { rcService } from '@domain';


export function HomeScreen() {
  useEffect(() => {
    rcService.getBalance({ address: "0xe9fd93F68131ebbC1C273E34288139C012698eaE", rpc: "https://sequoiarpc.sintrop.com"})
  }, []);

  return (
    <Screen home>
      <Text>Teste</Text>
    </Screen>
  );
}
