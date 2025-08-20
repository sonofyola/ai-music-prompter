const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  const platformPolyfill = path.resolve(__dirname, 'polyfills/Platform.js');
  
  // Add comprehensive webpack aliases
  config.resolve.alias = {
    ...config.resolve.alias,
    '../../Utilities/Platform': platformPolyfill,
    '../Utilities/Platform': platformPolyfill,
    './Utilities/Platform': platformPolyfill,
    'Utilities/Platform': platformPolyfill,
    'react-native/Libraries/Utilities/Platform': platformPolyfill,
  };
  
  // Ensure fallback resolution
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'Platform': platformPolyfill,
  };
  
  return config;
};