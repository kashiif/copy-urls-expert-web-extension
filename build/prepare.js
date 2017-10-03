var fileSystem = require('fs-extra'),
    path = require('path');

// clean the dist folder
fileSystem.emptyDirSync(path.join(__dirname, '../dist'));

// require('./generate_manifest');
