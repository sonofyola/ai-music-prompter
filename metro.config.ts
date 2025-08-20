const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver alias for Platform utilities
config.resolver.alias = {
  ...config.resolver.alias,
  '../../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
  '../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
  'react-native/Libraries/Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
};

// Ensure web platform is supported
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = wrapWithReanimatedMetroConfig(config);