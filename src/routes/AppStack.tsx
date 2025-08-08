import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens';

export type AppStackParamsList = {
  HomeScreen: undefined;
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
    </Stack.Navigator>
  );
}
