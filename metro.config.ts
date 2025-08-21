const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure all platforms are supported
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

module.exports = wrapWithReanimatedMetroConfig(config);
