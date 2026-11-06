import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Mapbox from "@rnmapbox/maps";
import Config from 'react-native-config';
import BootSplash from "react-native-bootsplash";

import { AppRoutes } from '@routes';
import { SettingsProvider, TxProvider, UserProvider, WalletProvider } from '@contexts';

import "./global.css";
import "./src/lang/i18n";

LogBox.ignoreLogs([
  'Possible Unhandled Promise Rejection',
  '`new NativeEventEmitter()` was called with a non-null',
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2 },
  },
});

function App() {
  useEffect(() => {
    Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
    hideBootSplash();
  }, []);
  
  function hideBootSplash() {
    setTimeout(() => BootSplash.hide({ fade: true }), 1000);
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <WalletProvider>
          <QueryClientProvider client={queryClient}>
            <SettingsProvider>
              <UserProvider>
                <TxProvider>
                  <AppRoutes />
                  <Toast />
                </TxProvider>
              </UserProvider>
            </SettingsProvider>
          </QueryClientProvider>
        </WalletProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
