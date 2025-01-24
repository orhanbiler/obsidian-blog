const path = require('path');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/')
  };

  // Add static file handling
  config.devServer = {
    ...config.devServer,
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
    },
    historyApiFallback: true,
  };

  return config;
}; 