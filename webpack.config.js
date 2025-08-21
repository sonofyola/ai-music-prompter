const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add fallback for missing asset registry
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "missing-asset-registry-path": false,
  };
  
  // Configure asset handling for React Navigation
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|svg)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    },
  });
  
  return config;
};