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

// Custom resolver to intercept Platform imports
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Intercept Platform utility imports
  if (moduleName.includes('Utilities/Platform')) {
    return {
      filePath: path.resolve(__dirname, 'polyfills/Platform.js'),
      type: 'sourceFile',
    };
  }
  
  // Use original resolver
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

// Also add alias as backup
config.resolver.alias = {
  ...config.resolver.alias,
  '../../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
  '../Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
};

module.exports = wrapWithReanimatedMetroConfig(config);