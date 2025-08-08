module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-worklets/plugin',
    ['module-resolver', {
      root: '.',
      alias: {
        '@routes': './src/routes',
        '@screens': './src/screens'
      },
    }],
  ]
};
