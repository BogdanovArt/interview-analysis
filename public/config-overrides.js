const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
  config.resolve.alias['@'] = path.resolve(__dirname, 'src/');
  config = rewireReactHotLoader(config, env);
  config.devServer = {
    watchOptions: {
      poll: 1000,
      aggregateTimeout: 200,
    }
  }
  return config;
};
