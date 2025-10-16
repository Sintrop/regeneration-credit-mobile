import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  HomeScreen, 
  PdfViewScreen, 
  RegisterScreen, 
  ResourceScreen, 
  ResourcesTypes, 
  UserDetailsScreen 
} from '@screens';

export type AppStackParamsList = {
  HomeScreen: undefined;
  RegisterScreen: undefined;
  UserDetailsScreen: {
    address: string;
  }
  ResourceScreen: {
    id: number;
    resourceType: ResourcesTypes;
  }
  PdfViewScreen: {
    uri: string;
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
      <Stack.Screen name="PdfViewScreen" component={PdfViewScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
