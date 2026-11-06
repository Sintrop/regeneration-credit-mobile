/**
 * Browser globals that MetaMask Connect reads and React Native does not define.
 * Loaded right after react-native-get-random-values, before any other module.
 */
import { Buffer } from 'buffer';

const globalScope = global as any;

if (!globalScope.Buffer) {
  globalScope.Buffer = Buffer;
}

const windowScope = globalScope.window ?? {};

if (!windowScope.location) {
  windowScope.location = {
    hostname: 'regenerationcredit.org',
    href: 'https://regenerationcredit.org',
  };
}
if (typeof windowScope.addEventListener !== 'function') {
  windowScope.addEventListener = () => {};
}
if (typeof windowScope.removeEventListener !== 'function') {
  windowScope.removeEventListener = () => {};
}
if (typeof windowScope.dispatchEvent !== 'function') {
  windowScope.dispatchEvent = () => true;
}

globalScope.window = windowScope;
