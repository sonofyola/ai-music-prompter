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

// Add asset search paths to include both assets/images and images directories
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'
];

// Enhanced server configuration with proper CORS handling
config.server = {
  port: 8081,
  host: '0.0.0.0',
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // Set comprehensive CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
      
      // Handle preflight OPTIONS requests
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      // Continue with the original middleware
      return middleware(req, res, next);
    };
  },
};

module.exports = wrapWithReanimatedMetroConfig(config);
