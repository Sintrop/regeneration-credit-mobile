import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  HomeScreen, 
  ImpactCalculatorScreen, 
  MyTokensScreen, 
  PdfViewScreen, 
  RegisterScreen, 
  ResourceScreen, 
  ResourcesTypes, 
  UserDetailsScreen 
} from '@screens';

export type AppStackParamsList = {
  HomeScreen: undefined;
  RegisterScreen: undefined;
  ImpactCalculatorScreen: undefined;
  MyTokensScreen: undefined;
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
      <Stack.Screen name="ImpactCalculatorScreen" component={ImpactCalculatorScreen} />
      <Stack.Screen name="MyTokensScreen" component={MyTokensScreen} />
    </Stack.Navigator>
  );
}
