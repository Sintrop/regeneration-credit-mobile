import { useEffect } from 'react';
import { Alert, Button, Text } from 'react-native';
import { useSDK } from '@metamask/sdk-react';
import { Screen } from '@components';

export function HomeScreen() {
  const { sdk } = useSDK();

  useEffect(() => {
    console.log(sdk);
  }, [sdk]);
  async function connectWallet() {
    if (!sdk) {
      Alert.alert('not sdk');
      return;
    }

    const accounts = await sdk.connect();
    Alert.alert(accounts[0])
  }

  return (
    <Screen home>
      <Text className='text-red-500'>Sintrop mobile</Text>
      <Button title="connect" onPress={connectWallet} />
    </Screen>
  );
}
