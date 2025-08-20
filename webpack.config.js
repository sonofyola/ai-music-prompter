const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add alias to resolve the Platform utility issue
  config.resolve.alias = {
    ...config.resolve.alias,
    '../../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
    '../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
  };
  
  return config;
};