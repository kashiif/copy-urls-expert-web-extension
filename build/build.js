const path = require('path');
const pkgJSON = require('../package.json');
const ZipFilesPlugin = require('webpack-zip-files-plugin');

const multiConfig = require('./webpack.config');
const CONFIG_TARGETS = [{
    targetName: 'firefox',
    ext: 'xpi',
  }, {
    targetName: 'chrome',
    ext: 'zip',
  }];

const PATH_TO_DIST = path.join(path.resolve(__dirname, '..'), 'dist');

multiConfig.forEach(function(cfg, index) {
  const cfgTarget = CONFIG_TARGETS[index];

  cfg.plugins.push(
    new ZipFilesPlugin({
      entries: [
        { src: path.join(PATH_TO_DIST, cfgTarget.targetName), dist: '.' },
      ],
      output: path.join(PATH_TO_DIST, `${pkgJSON.name}-${pkgJSON.version}`),
      format: 'zip',
      ext: cfgTarget.ext,
    }));
});

require('./prepare');

delete multiConfig.chromeExtensionBoilerplate;

module.exports = multiConfig;
