module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // IMPORTANTE: não adicione 'react-native-reanimated/plugin' aqui.
    // A partir do Reanimated v4 (SDK 54), o plugin é configurado
    // automaticamente pelo babel-preset-expo.
    plugins: [],
  };
};
