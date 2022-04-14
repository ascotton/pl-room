const envConfigFile = {};

envConfigFile.getFileString = (isProd, envConfig, envKey, gitSha) => {
    return `
    export const environment = {
        env_key: "${envKey}",
        production: ${isProd},
        app_name: "${(process.env.APP_NAME || 'room')}",
        cookie_domain: "${(process.env.COOKIE_DOMAIN || envConfig.cookieDomain)}",
        heap_key: "${(process.env.HEAP_KEY || envConfig.heapKey)}",
        sentry_key: "${(process.env.SENTRY_KEY || envConfig.sentryKey)}",
        speed_of_me: ${JSON.stringify((process.env.SPEED_OF_ME || envConfig.speedOfMe), null, 4)},
        remote_hq_src: "${(process.env.REMOTE_HQ_SRC || envConfig.remoteHQSrc)}",
        git_sha: "${gitSha}",
        apps: ${JSON.stringify((process.env.APPS || envConfig.apps), null, 4)},
        room: ${JSON.stringify((process.env.ROOM || envConfig.room), null, 4)},
        feature_flags: ${JSON.stringify((process.env.FEATURE_FLAGS || envConfig.featureFlags), null, 4)},
    };
    `;
};

module.exports = envConfigFile;