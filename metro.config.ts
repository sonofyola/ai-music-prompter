const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable package exports to avoid warnings
config.resolver.unstable_enablePackageExports = false;

// Add resolver configuration to handle common warnings
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Silence common warnings
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = wrapWithReanimatedMetroConfig(config);
