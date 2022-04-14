module.exports = {
    cookieDomain: 'localhost',
    heapKey: '',
    sentryKey: '',
    remoteHQSrc: 'presencelearningtest',
    speedOfMe: {
        key: 'SOM56b3b6dd9be9b',
        domain: 'room.presencestag.com',
    },
    liveagent: {
        "endpoint": "https://d.la2-c2cs-ph2.salesforceliveagent.com/chat",
        "buttonId":"57380000000GnQ2",
        "initArg1":"57280000000CbGq",
        "initArg2":"00D8A000000D0oY"
    },
    testDataCacheType: '',
    room: {
        inactiveSeconds: 3600,
        restoreQueueHardDeleteTime: 1,
        restoreQueueHardDeleteUnit: 'hours'
    },
    featureFlags: {
        sharedCursorTokbox: 0
    },
    apps: {
        apiJira: {
            url: process.env.APIJIRA_URL || 'https://dev.platform.presencestag.com',
        },
        apiTechcheck: {
            url: process.env.APITECHCHECK_URL || 'https://dev.techcheck.presencestag.com',
        },
        apiWorkplace: {
            url: process.env.APIWORKPLACE_URL || 'https://dev.workplace.presencestag.com',
        },
        auth: {
            url: process.env.AUTH_URL || 'https://dev.login.presencestag.com',
        },
        admin: {
            url: process.env.ADMIN_URL || 'https://dev.apps.presencestag.com/admin',
        },
        apollo: {
            url: process.env.APOLLO_URL || 'https://dev.workplace.presencestag.com/graphql/v1/',
        },
        apps: {
            url: process.env.APPS_URL || 'https://dev.apps.presencestag.com',
            cookieDomain: process.env.APPS_COOKIE_DOMAIN || '.presencestag.com',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'https://dev.apps.presencestag.com/components',
        },
        eduClients: {
            url: process.env.EDUCLIENTS_URL || 'https://dev.apps.presencestag.com/c',
        },
        flutterApp: {
            // url: process.env.FLUTTER_APP_URL || 'https://flutterapp.presencestag.com',
            url: process.env.FLUTTER_APP_URL || 'http://localhost:3009',
        },
        hamm: {
            url: process.env.HAMM_URL || 'https://dev.apps.presencestag.com/c/billing',
        },
        help: {
            url: process.env.HELP_URL || 'https://presencelearning.helpjuice.com'
        },
        landing: {
            url: process.env.LANDING_URL || 'https://dev.apps.presencestag.com/landing',
        },
        platform: {
            url: process.env.PLATFORM_URL || 'https://dev.platform.presencestag.com',
        },
        library: {
            url: process.env.LIBRARY_URL || 'https://dev.library.presencestag.com',
        },
        lightyear: {
            url: process.env.LIGHTYEAR_URL || 'https://dev.room.presencestag.com',
        },
        room: {
            url: process.env.ROOM_URL || 'https://dev.room.presencestag.com',
        },
        rex: {
            url: process.env.REX_URL || 'https://dev.apps.presencestag.com/clients',
        },
        techcheck: {
            url: process.env.TECHCHECK_URL || 'https://dev.setup.presencestag.com',
        },
        toychest: {
            url: process.env.TOYCHEST_URL || 'https://dev.store.presencestag.com',
        },
        toys: {
            url: process.env.TOYS_URL || 'https://dev.apps.presencestag.com',
        },
        woody: {
            url: process.env.WOODY_URL || 'https://dev.apps.presencestag.com/c/schedule',
        },
    },
};
