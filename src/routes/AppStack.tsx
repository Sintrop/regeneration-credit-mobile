import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, UserDetailsScreen } from '@screens';

export type AppStackParamsList = {
  HomeScreen: undefined;
  UserDetailsScreen: {
    address: string;
  }
};
const Stack = createNativeStackNavigator<AppStackParamsList>();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
    </Stack.Navigator>
  );
}
