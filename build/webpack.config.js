const path = require('path');
const { createConfig } = require('./webpack.shared.config');

const firefoxBuild = Object.assign({}, createConfig(), {
  output: {
    path: path.join(path.dirname(__dirname), 'dist', 'firefox'),
    filename: '[name].bundle.js',
  },
});

const chromeBuild = Object.assign({}, createConfig(), {
  output: {
    path: path.join(path.dirname(__dirname), 'dist', 'chrome'),
    filename: '[name].bundle.js'
  },
});

module.exports = [ firefoxBuild, chromeBuild ];
