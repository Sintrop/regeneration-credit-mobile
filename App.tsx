import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MMProvider } from './src/providers/Metamask';
import { AppRoutes } from '@routes';

import "./global.css";

LogBox.ignoreLogs([
  'Possible Unhandled Promise Rejection',
  'Message ignored because invalid key exchange status',
  "MetaMask: 'ethereum._metamask' exposes",
  '`new NativeEventEmitter()` was called with a non-null',
  'Sender: Failed to send batch Error',
]);

function App() {
  return (
    <MMProvider>
      <SafeAreaProvider>
        <AppRoutes />
      </SafeAreaProvider>
    </MMProvider>
  );
}

export default App;
