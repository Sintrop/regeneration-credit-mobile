/**
 * @format
 */

import 'react-native-get-random-values';
import './src/polyfills';
import 'node-libs-react-native/globals';
import 'react-native-url-polyfill/auto';
import 'text-encoding';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
