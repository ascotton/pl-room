const through = require('through2');
const fs = require('fs');
const _template = require('lodash.template')
const exec = require('child_process').exec;
let config = require('../../cypress/support/config/config');

module.exports = function(template_path, dest_path) {
    function extendConfig(config1) {
        let envConfig = config1._envConfig;
        const keys = ['room', 'remoteHQSrc'];
        keys.forEach((key) => {
            if (envConfig[key]) {
                config1[key] = envConfig[key];
            }
        });
        return config1;
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

    function formApps(appUrls) {
        authUrl = `${appUrls.auth}/`;
        // Build ng1 style apps.
        // Skipped: apiJira, apiBilling, apiSchedule, apiClient, rex, schedule, billing
        const apps = {
            auth: {
                name: "auth",
                url: authUrl,
                loginUrl: appUrls.login,
                changePassword: `${authUrl}password/change`,
                logoutUrl: appUrls.logout,
                statusUrl: `${authUrl}api/v1/status/`,
                rightsUrl: `${authUrl}api/v1/user/`,
                hijackReleaseUrl: `${authUrl}hijack/release-hijack/`,
                clientTokenUrl: `${authUrl}api/v2/users/generate_client_token/`,
            },
            platform: {
                url: appUrls.platformFE,
            },
            landing: {
                url: appUrls.landingFE,
            },
            apiWorkplace: {
                url: appUrls.workplaceBE,
                providersUrl: `${appUrls.workplaceBE}/api/v1/providers/`,
            },
            room: {
                url: appUrls.roomFE,
            },
            apps: {
                url: appUrls.homeFE,
                cookieDomain: appUrls.cookieDomain,
            },
            library: {
                url: appUrls.libraryFE,
            },
            woody: {
                url: appUrls.scheduleFE,
            },
            clients: {
                url: appUrls.clientsFE,
            },
            hamm: {
                url: appUrls.billingFE,
            },
            educlients: {
                url: appUrls.eduClientsFE,
            },
            trainingFaq: {
                url: "https://www.presencelearning.com/welcome-to-the-presencelearning-environment/",
            },
            apiTechcheck: {
                url: appUrls.techcheckFE,
            },
            techcheck: {
                url: appUrls.techcheckFE,
            },
            help: {
                url: "https://presencelearning.helpjuice.com"
            },
            lightyear: {
                url: appUrls.lightyear,
            },
            toychest: {
                url: appUrls.libraryFE,
            },
            toys: {
                url: appUrls.toys,
            },
        };
        // const authApps = ['auth', 'login', 'logout']
        // for (app in appUrls) {
        //     if (!authApps.includes(app)) {
        //         apps[app] = {
        //             url: appUrls[app],
        //         };
        //     }
        // }
        return apps;
    }

    if (!template_path) {
        throw new Error('gulp-config_ng1: Missing template path.');
    }

    if(!dest_path) {
        throw new Error('gulp-config_ng1: Missing dest path.');
    }

    fs.readFile(template_path, 'utf8', function(err, data) {
        config = extendConfig(config);
        gitRevision(function(gitSha) {
            const compiled_template = _template(data);
            const result = compiled_template({
                flavor: config.flavor || 'dev',
                sha: gitSha,
                lastCommit: '',
                liveagent: config.liveagent || {"endpoint":"https://d.la4-c1-chi.salesforceliveagent.com/chat","buttonId":"57380000000GnQ2","initArg1":"57280000000CbGq","initArg2":"00D80000000aMap"},
                heapKey: config.heapKey,
                sentryKey: config.sentryKey,
                remoteHQSrc: config.remoteHQSrc,
                // applications: config.appUrls,
                applicationsDefaults: formApps(config.appUrls),
                versions: {
                    pdfjs: config.versionPdf || '1.5.201',
                },
                envRoom: config.room,
            });
            fs.writeFileSync(dest_path, result);
        });
    });
    return true;
};
