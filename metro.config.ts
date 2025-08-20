const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Create the platform polyfill path
const platformPolyfill = path.resolve(__dirname, 'polyfills/Platform.js');

// Add comprehensive resolver aliases
config.resolver.alias = {
  ...config.resolver.alias,
  // Direct path resolutions
  '../../Utilities/Platform': platformPolyfill,
  '../Utilities/Platform': platformPolyfill,
  './Utilities/Platform': platformPolyfill,
  'Utilities/Platform': platformPolyfill,
  // React Native specific paths
  'react-native/Libraries/Utilities/Platform': platformPolyfill,
  'react-native/Libraries/Utilities/Platform.js': platformPolyfill,
  // Additional fallbacks
  '@react-native/js-polyfills/Platform': platformPolyfill,
};

// Ensure all platforms are supported
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

// Add resolver extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

module.exports = wrapWithReanimatedMetroConfig(config);