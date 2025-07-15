// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      // Expo-Preset with proper configuration
      ['babel-preset-expo', { 
        jsxImportSource: 'nativewind',
        lazyImports: true,
        native: {
          unstable_transformProfile: 'default'
        }
      }],
      // NativeWind preset
      'nativewind/babel',
    ],
    plugins: [
      // dotenv plugin
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true
      }],
      // Reanimated plugin (must be last)
      'react-native-reanimated/plugin',
    ],
  };
};
