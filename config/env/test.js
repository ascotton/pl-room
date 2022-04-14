module.exports = {
    cookieDomain: 'presencetest.com',
    heapKey: '',
    sentryKey: 'https://4bcd2931b66e4dd0b5ab0b6d1942c712@sentry.io/1279984',
    remoteHQSrc: 'presencelearningtest',
    speedOfMe: {
        key: 'SOM56b3b6dd9be9b',
        domain: 'room.precensetest.com',
    },
    liveagent: {
        "endpoint": "https://d.la2-c2cs-ph2.salesforceliveagent.com/chat",
        "buttonId":"57380000000GnQ2",
        "initArg1":"57280000000CbGq",
        "initArg2":"00D8A000000D0oY"
    },
    testDataCacheType: 'none',
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
            url: process.env.APIJIRA_URL || 'https://platform.presencetest.com',
        },
        apiTechcheck: {
            url: process.env.APITECHCHECK_URL || 'https://techcheck.presencetest.com',
        },
        apiWorkplace: {
            url: process.env.APIWORKPLACE_URL || 'https://workplace.presencetest.com',
        },
        auth: {
            url: process.env.AUTH_URL || 'https://login.presencetest.com',
        },
        admin: {
            url: process.env.ADMIN_URL || 'https://apps.presencetest.com/admin',
        },
        apollo: {
            url: process.env.APOLLO_URL || 'https://workplace.presencetest.com/graphql/v1/',
        },
        apps: {
            url: process.env.APPS_URL || 'https://apps.presencetest.com',
            cookieDomain: process.env.APPS_COOKIE_DOMAIN || '.presencetest.com',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'https://apps.presencetest.com/components',
        },
        eduClients: {
            url: process.env.EDUCLIENTS_URL || 'https://apps.presencetest.com/c',
        },
        flutterApp: {
            url: process.env.FLUTTER_APP_URL || 'https://flutterapp.presencetest.com',
        },
        hamm: {
            url: process.env.HAMM_URL || 'https://apps.presencetest.com/c/billing',
        },
        help: {
            url: process.env.HELP_URL || 'https://presencelearning.helpjuice.com'
        },
        landing: {
            url: process.env.LANDING_URL || 'https://apps.presencetest.com/landing',
        },
        platform: {
            url: process.env.PLATFORM_URL || 'https://platform.presencetest.com',
        },
        library: {
            url: process.env.LIBRARY_URL || 'https://library.presencetest.com',
        },
        lightyear: {
            url: process.env.LIGHTYEAR_URL || 'https://room.presencetest.com',
        },
        room: {
            url: process.env.ROOM_URL || 'https://room.presencetest.com',
        },
        rex: {
            url: process.env.REX_URL || 'https://apps.presencetest.com/clients',
        },
        techcheck: {
            url: process.env.TECHCHECK_URL || 'https://setup.presencetest.com',
        },
        toychest: {
            url: process.env.TOYCHEST_URL || 'https://store.presencetest.com',
        },
        toys: {
            url: process.env.TOYS_URL || 'https://apps.presencetest.com',
        },
        woody: {
            url: process.env.WOODY_URL || 'https://apps.presencetest.com/c/schedule',
        },
    },
};
