const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Create the platform polyfill path
const platformPolyfill = path.resolve(__dirname, 'polyfills/Platform.js');

// Add resolver aliases for Platform polyfill
config.resolver.alias = {
  ...config.resolver.alias,
  '../../Utilities/Platform': platformPolyfill,
  '../Utilities/Platform': platformPolyfill,
  './Utilities/Platform': platformPolyfill,
  'Utilities/Platform': platformPolyfill,
  'react-native/Libraries/Utilities/Platform': platformPolyfill,
};

// Ensure all platforms are supported
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

module.exports = wrapWithReanimatedMetroConfig(config);