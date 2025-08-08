import { Alert, Button, Text, View } from 'react-native';
import { useSDK } from '@metamask/sdk-react';
import { useEffect } from 'react';

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
    console.log(accounts);
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Sintrop mobile</Text>
      <Button title="connect" onPress={connectWallet} />
    </View>
  );
}
