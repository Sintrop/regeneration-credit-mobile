import { NavigationContainer } from '@react-navigation/native';
import { Host } from 'react-native-portalize';

import { AppStack } from './AppStack';

export function AppRoutes() {
  return (
    <NavigationContainer>
      <Host>
        <AppStack />
      </Host>
    </NavigationContainer>
  );
}
