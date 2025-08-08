import { LogBox } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen/HomeScreen';
import { MMProvider } from './src/providers/Metamask';

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
      <HomeScreen />
    </MMProvider>
  );
}

export default App;
