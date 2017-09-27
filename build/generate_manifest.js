var manifest = require('../src/manifest.json'),
    fileSystem = require('fs'),
    path = require('path'),
    env = require('../config');

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
// manifest.version = process.env.npm_package_version;

fileSystem.writeFileSync(
  path.join(__dirname, '../dist/manifest.json'),
  JSON.stringify(manifest)
);
