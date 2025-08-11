import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

function App() {
  useEffect(() => {
    feedDB.createTables();
  }, []);

  return (
    <MMProvider>
      <SafeAreaProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </SafeAreaProvider>
    </MMProvider>
  );
}

export default App;
