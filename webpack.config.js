const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add alias for missing asset registry
  config.resolve.alias = {
    ...config.resolve.alias,
    'missing-asset-registry-path': path.resolve(__dirname, 'utils/asset-registry.js'),
  };
  
  // Configure asset handling for fonts and images
  config.module.rules.push({
    test: /\.(ttf|otf|woff|woff2)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'static/fonts/',
        publicPath: '/static/fonts/',
      },
    },
  });
  
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|svg)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'static/images/',
        publicPath: '/static/images/',
      },
    },
  });
  
  return config;
};