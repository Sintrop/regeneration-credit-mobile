import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Mapbox from "@rnmapbox/maps";
import Config from 'react-native-config';

import { MMProvider } from '@providers';
import { AppRoutes } from '@routes';
import { SettingsProvider, TxProvider, UserProvider } from '@contexts';
import { database } from '@database';

import "./global.css";
import "./src/lang/i18n";

LogBox.ignoreLogs([
  'Possible Unhandled Promise Rejection',
  'Message ignored because invalid key exchange status',
  "MetaMask: 'ethereum._metamask' exposes",
  '`new NativeEventEmitter()` was called with a non-null',
  'Sender: Failed to send batch Error',
]);

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initDatabase();
    Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
  }, []);

  async function initDatabase() {
    await database.openDB();
    await database.createTable();
  }

  return (
    <MMProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView>
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
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </MMProvider>
  );
}

export default App;
