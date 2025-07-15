// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure proper module resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Fix import.meta issues for web
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Web-specific configuration
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

// Additional web fixes for import.meta
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Fix for web bundling issues
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Exclude problematic packages from web bundle
config.resolver.blockList = [
  /.*\/__tests__\/.*/,
  /.*\/android\/.*/,
  /.*\/ios\/.*/,
];

// Web-specific transformer options
if (process.env.EXPO_PLATFORM === 'web') {
  config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  };
}

module.exports = withNativeWind(config, { input: './global.css' });
