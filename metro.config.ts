const { getDefaultConfig } = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure all platforms are supported
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

// Add asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
  'ttf',
  'otf',
  'woff',
  'woff2'
];

// Configure transformer for better asset handling
config.transformer = {
  ...config.transformer,
  assetRegistryPath: require.resolve('react-native/Libraries/Image/AssetRegistry'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Add resolver configuration for web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

// Configure web-specific settings
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias = {
    ...config.resolver.alias,
    'react-native': 'react-native-web',
    'react-native/Libraries/Image/AssetRegistry': 'react-native-web/dist/modules/AssetRegistry',
  };
}

module.exports = wrapWithReanimatedMetroConfig(config);