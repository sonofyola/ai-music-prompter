const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// Basic configuration for all platforms
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

// Add asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'
];

// For web, resolve the missing asset registry path to a dummy module
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias = {
    ...config.resolver.alias,
    'missing-asset-registry-path': require.resolve('react-native-web/dist/modules/AssetRegistry'),
  };
}

module.exports = wrapWithReanimatedMetroConfig(config);