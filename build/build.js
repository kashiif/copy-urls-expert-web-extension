var config = require('./webpack.config');

require('./prepare');

delete config.chromeExtensionBoilerplate;

module.exports = config;
