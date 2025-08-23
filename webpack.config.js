const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add alias for missing asset registry
  config.resolve.alias = {
    ...config.resolve.alias,
    'missing-asset-registry-path': path.resolve(__dirname, 'utils/asset-registry.js'),
  };
  
  // Add devServer configuration to handle CORS
  if (config.devServer) {
    config.devServer = {
      ...config.devServer,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      },
      allowedHosts: 'all',
    };
  }
  
  return config;
};
