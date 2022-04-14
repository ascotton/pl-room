// https://medium.com/@natchiketa/angular-cli-and-os-environment-variables-4cfa3b849659

const fs = require('fs');
const writeFile = fs.writeFile;
const argv = require('yargs').argv;
const exec = require('child_process').exec;

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

const envConfigFile = require('../config/env-config-file');

// Would be passed to script like this:
// `node node-scripts/set-env.ts --envkey=test`
// we get it from yargs's argv object

const envKey = argv.envkey || 'local';
const envKeyFileToUse = (envKey === 'dev') ? 'local' : envKey;
const envKeyFileName = (envKey === 'dev') ? '' : `.${envKey}`;
const envFile = `../config/env/${envKeyFileToUse}.js`;
let envConfig = require(envFile);

const isProd = (envKey === 'live');

function go() {
    gitRevision(function(gitSha) {
        writeEnvFile(gitSha);
        envConfigToIndexHtml();
    });
}

function writeEnvFile(gitSha) {
    const targetDir = './src/environments';
    const targetPath = `${targetDir}/environment${envKeyFileName}.ts`;
    const envFileString = envConfigFile.getFileString(isProd, envConfig, envKey, gitSha);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    writeFile(targetPath, envFileString, function (err) {
        if (err) {
            console.log(err);
        }

        console.log(`Output generated at ${targetPath}`);
    });
}

function gitRevision(callback) {
    exec('git rev-parse --short HEAD',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('git error: ' + error + stderr);
            }
            callback(stdout.toString().trim());
        });
}

function envConfigToIndexHtml() {
    const targetPath = './src/index-template.html';
    const newTargetPath = './src/index.html';
    fileData = fs.readFileSync(targetPath);
    const start = fileData.indexOf('<!-- <env-config.js>');
    if (start > -1) {
        const warningString = '\n<!-- GENERATED FILE from index-template.html - edit that file instead; any changes you make here will be overwritten! -->\n';
        if (['stag', 'k8s'].includes(envKey)) {
            const endString = '-->';
            const end = fileData.indexOf(endString, start);
            const envConfigString = '<script type="text/javascript" src="/env-config.js"></script>';
            const posInsert = end + endString.length;
            const newFileData = [warningString, fileData.slice(0, posInsert), envConfigString, fileData.slice(posInsert), warningString].join('\n');
            fs.writeFileSync(newTargetPath, newFileData);
            console.log('index.html updated with env-config.js');
        }
        else {
            // Still need to write it, but unchanged.
            const newFileData = [warningString, fileData, warningString].join('\n');
            fs.writeFileSync(newTargetPath, newFileData);
        }
    }
}

go();