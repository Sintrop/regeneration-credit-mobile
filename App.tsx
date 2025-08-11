import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { MMProvider } from '@providers';
import { AppRoutes } from '@routes';
import { SettingsProvider } from '@contexts';
import { feedDB } from '@services';

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
    feedDB.createTables();
  }, []);

  return (
    <MMProvider>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <AppRoutes />
          </SettingsProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </MMProvider>
  );
}

export default App;
