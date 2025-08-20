const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable package exports to avoid warnings
config.resolver.unstable_enablePackageExports = false;
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add alias to resolve the Platform utility issue
config.resolver.alias = {
  ...config.resolver.alias,
  // Map the problematic Platform import to our polyfill
  '../../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
  '../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
  'react-native/Libraries/Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
};

module.exports = wrapWithReanimatedMetroConfig(config);