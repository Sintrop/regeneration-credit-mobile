import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from './AppStack';

export function AppRoutes() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
