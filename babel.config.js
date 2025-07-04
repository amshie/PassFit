// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      // Expo-Preset mit NativeWind JSX-Import
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      // NativeWind als Preset (wichtig für v4!)
      'nativewind/babel',
    ],
    plugins: [
      // dotenv (so wie bisher)
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env'
      }],
      // Falls du Reanimated nutzt:
      'react-native-reanimated/plugin',
    ],
  };
};
