const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Basic configuration
config.resolver.unstable_enablePackageExports = false;
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add alias mapping for the problematic Platform imports
config.resolver.alias = {
  ...config.resolver.alias,
  '../../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
  '../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
};

module.exports = wrapWithReanimatedMetroConfig(config);