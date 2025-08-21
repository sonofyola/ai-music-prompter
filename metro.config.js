const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Basic resolver configuration
config.resolver.alias = {
  'missing-asset-registry-path': path.resolve(__dirname, 'utils/asset-registry.js'),
};

// Remove any custom server configuration that might be causing issues
delete config.server;

module.exports = config;