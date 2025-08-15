import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ResourceScreen, ResourcesTypes, UserDetailsScreen } from '@screens';

export type AppStackParamsList = {
  HomeScreen: undefined;
  UserDetailsScreen: {
    address: string;
  }
  ResourceScreen: {
    id: number;
    resourceType: ResourcesTypes;
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
      <Stack.Screen name="ResourceScreen" component={ResourceScreen} />
    </Stack.Navigator>
  );
}
