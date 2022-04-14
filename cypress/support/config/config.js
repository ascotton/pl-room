const plCypressShared = require('pl-cypress-shared');

require('dotenv').config();

let envKey = (typeof(Cypress) !== 'undefined' && Cypress.env() && Cypress.env().ENVKEY) || 'local';
if (process.env.ENVKEY !== undefined) {
    envKey = process.env.ENVKEY;
}

// Get from command line arguments too.
function getCommandArgs() {
    const args = process.argv.slice(2, process.argv.length);
    let argsObj = {};
    let obj1;
    let xx;
    args.forEach((val, index, array) => {
        if(val.indexOf('=') > -1) {
            obj1 = val.split('=');
            argsObj[obj1[0]] = obj1[1];
        }
    });
    console.log('args', argsObj, args);
    return argsObj;
}
const args = getCommandArgs();
if (args.envKey) {
    envKey = args.envKey;
}

// const envFile = `../../../config/env/${envKey}`;
// var envConfig = require(envFile);
// Import and export must be static so can not use variables here..
// Have to hard coded all possible environment configs.
let envConfigLive = require('../../../config/env/live');
let envConfigTest = require('../../../config/env/test');
let envConfigStag = require('../../../config/env/stag');
let envConfigStagDev = require('../../../config/env/stagdev');
let envConfigEnv17 = require('../../../config/env/env17');
let envConfigK8sDev = require('../../../config/env/k8sdev');
let envConfigLocal = require('../../../config/env/local');
let envConfigLocalDev = require('../../../config/env/localdev');
var envConfig = envConfigLocal;
if (envKey === 'live') {
    envConfig = envConfigLive;
} else if (envKey === 'stag') {
    envConfig = envConfigStag;
} else if (envKey === 'stagdev') {
    envConfig = envConfigStagDev;
} else if (envKey === 'test') {
    envConfig = envConfigTest;
} else if (envKey === 'localdev') {
    envConfig = envConfigLocalDev;
} else if (envKey === 'env17') {
    envConfig = envConfigEnv17;
}else if (envKey === 'k8sdev') {
    envConfig = envConfigK8sDev;
}

const config = {};
config.set = () => {
    const keys = plCypressShared.plConfig.set(envConfig);
    for (let key in keys) {
        config[key] = keys[key];
    }
};
config.set();
config._envConfig = envConfig;

module.exports = config;
