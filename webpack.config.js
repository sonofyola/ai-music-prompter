const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add alias for missing asset registry
  config.resolve.alias = {
    ...config.resolve.alias,
    'missing-asset-registry-path': path.resolve(__dirname, 'utils/asset-registry.js'),
  };
  
  // Handle font files specifically
  config.module.rules.push({
    test: /\.(ttf|otf|woff|woff2)$/,
    type: 'asset/resource',
    generator: {
      filename: 'static/fonts/[name].[hash][ext]',
    },
  });
  
  // Ignore asset registry imports in font files
  config.module.rules.push({
    test: /\.ttf$/,
    use: [
      {
        loader: 'ignore-loader',
        options: {
          // Ignore the missing-asset-registry-path import
          ignore: /missing-asset-registry-path/,
        },
      },
    ],
  });
  
  return config;
};