const path = require('path')
const config_ng1Plugin = require('./config_ng1.plugin');

config_ng1Plugin(
    path.join(__dirname, 'config_ng1.template'),
    path.join(__dirname, '..', '..', 'src', 'build', 'config_ng1.js'),
);
