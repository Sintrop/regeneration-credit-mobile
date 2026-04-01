import { UserType } from '@domain';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  CommunityScreen,
  HomeScreen, 
  ImpactCalculatorScreen, 
  InspectionsScreen, 
  MyTokensScreen, 
  PdfViewScreen, 
  PoolDetailsScreen, 
  PoolsScreen, 
  ProfileScreen, 
  RegisterScreen, 
  ResourceScreen, 
  ResourcesTypes, 
  TokenImpactScreen, 
  UserDetailsScreen, 
  UsersListScreen
} from '@screens';

export type AppStackParamsList = {
  HomeScreen: undefined;
  RegisterScreen: undefined;
  ImpactCalculatorScreen: undefined;
  MyTokensScreen: undefined;
  TokenImpactScreen: undefined;
  CommunityScreen: undefined;
  InspectionsScreen: undefined;
  PoolsScreen: undefined;
  PoolDetailsScreen: {
    userType: number;
  }
  UserDetailsScreen: {
    address: string;
  }
  ProfileScreen: {
    address: string;
  }
  ResourceScreen: {
    id: number;
    resourceType: ResourcesTypes;
  }
  PdfViewScreen: {
    uri: string;
  }
  UsersListScreen: {
    userType: UserType;
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
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ResourceScreen" component={ResourceScreen} />
      <Stack.Screen name="PdfViewScreen" component={PdfViewScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ImpactCalculatorScreen" component={ImpactCalculatorScreen} />
      <Stack.Screen name="MyTokensScreen" component={MyTokensScreen} />
      <Stack.Screen name="TokenImpactScreen" component={TokenImpactScreen} />
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen name="InspectionsScreen" component={InspectionsScreen} />
      <Stack.Screen name="UsersListScreen" component={UsersListScreen} />
      <Stack.Screen name="PoolsScreen" component={PoolsScreen} />
      <Stack.Screen name="PoolDetailsScreen" component={PoolDetailsScreen} />
    </Stack.Navigator>
  );
}
