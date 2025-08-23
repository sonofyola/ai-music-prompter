const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Basic configuration for all platforms
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

// Add asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'
];

// For web, resolve the missing asset registry path to our custom module
config.resolver.alias = {
  ...config.resolver.alias,
  'missing-asset-registry-path': path.resolve(__dirname, 'utils/asset-registry.js'),
};

// Simplified server configuration to avoid CORS conflicts
config.server = {
  port: 8081,
  host: '0.0.0.0',
};

// Remove any custom middleware that might cause CORS issues
delete config.server?.enhanceMiddleware;

module.exports = wrapWithReanimatedMetroConfig(config);
