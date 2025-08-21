const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add alias for missing asset registry
  config.resolve.alias = {
    ...config.resolve.alias,
    'missing-asset-registry-path': path.resolve(__dirname, 'utils/asset-registry.js'),
  };
  
  // Simplified configuration to avoid CORS issues
  return config;
};
