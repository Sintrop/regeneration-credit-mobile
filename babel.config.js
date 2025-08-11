module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    'react-native-worklets/plugin',
    ['module-resolver', {
      root: '.',
      alias: {
        '@routes': './src/routes',
        '@screens': './src/screens',
        '@components': './src/components',
        '@hooks': './src/hooks',
        '@contracts': './src/contracts',
        '@utils': './src/utils',
        '@domain': './src/domain',
        '@contexts': './src/contexts',
        '@providers': './src/providers',
        '@services': './src/services',
        '@types': './src/types'
      },
    }],
  ]
};
