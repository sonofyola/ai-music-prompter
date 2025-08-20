const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Basic configuration to avoid module resolution issues
config.resolver.unstable_enablePackageExports = false;
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = wrapWithReanimatedMetroConfig(config);