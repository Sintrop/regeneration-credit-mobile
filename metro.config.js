const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Node built-ins with no React Native shim, referenced by code paths that never
// run in the app (the ws server side used by MetaMask Connect, for instance).
const emptyModule = path.resolve(__dirname, 'src/empty-module.js');
const nodeLibs = require('node-libs-react-native');
const nodeLibsWithStubs = Object.fromEntries(
  Object.entries(nodeLibs).map(([name, shim]) => [name, shim ?? emptyModule]),
);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      ...nodeLibsWithStubs,
      'node:crypto': require.resolve('react-native-crypto'),
    },
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'], //add here
  },
};

module.exports = withNativeWind(mergeConfig(defaultConfig, config), { input: './global.css' });
