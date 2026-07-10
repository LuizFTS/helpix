module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // IMPORTANTE: não adicione 'react-native-reanimated/plugin' aqui.
    // A partir do Reanimated v4 (usado pelo Expo SDK 54), o plugin do
    // Babel é configurado automaticamente pelo babel-preset-expo.
    // Adicionar manualmente causa o erro
    // "Cannot find module 'react-native-worklets/plugin'" (já vimos isso).
    plugins: [],
  };
};
