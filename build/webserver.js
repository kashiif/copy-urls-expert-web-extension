var WebpackDevServer = require('webpack-dev-server'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config'),
    env = require('../config'),
    path = require('path');

require('./prepare');

var options = (webpackConfig.chromeExtensionBoilerplate || {});
var excludeEntriesToHotReload = (options.notHotReload || []);

for (var entryName in webpackConfig.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {

    webpackConfig.entry[entryName] =
      [
        ('webpack-dev-server/client?http://localhost:' + env.PORT),
        'webpack/hot/dev-server'
      ].concat(webpackConfig.entry[entryName]);
  }
}

webpackConfig.plugins =
  [new webpack.HotModuleReplacementPlugin()].concat(webpackConfig.plugins || []);

delete webpackConfig.chromeExtensionBoilerplate;

var compiler = webpack(webpackConfig);

var server =
  new WebpackDevServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, '../dist'),
    headers: { 'Access-Control-Allow-Origin': '*' }
  });

server.listen(env.PORT);
