module.exports = {
    cookieDomain: 'presencestag.com',
    heapKey: '4014912286',
    sentryKey: 'https://4bcd2931b66e4dd0b5ab0b6d1942c712@sentry.io/1279984',
    remoteHQSrc: 'presencelearningtest',
    speedOfMe: {
        key: 'SOM60d26a7e8aa1b'
    },
    liveagent: {
        "endpoint": "https://d.la2-c2cs-ph2.salesforceliveagent.com/chat",
        "buttonId":"57380000000GnQ2",
        "initArg1":"57280000000CbGq",
        "initArg2":"00D8A000000D0oY"
    },
    testDataCacheType: '',
    room: {
        inactiveSeconds: 3600
    },
    featureFlags: {
        sharedCursorTokbox: 1
    },
    apps: {
        apiJira: {
            url: process.env.APIJIRA_URL || 'https://platform.presencestag.com',
        },
        apiTechcheck: {
            url: process.env.APITECHCHECK_URL || 'https://techcheck.presencestag.com',
        },
        apiWorkplace: {
            url: process.env.APIWORKPLACE_URL || 'https://workplace.presencestag.com',
        },
        auth: {
            url: process.env.AUTH_URL || 'https://login.presencestag.com',
        },
        admin: {
            url: process.env.ADMIN_URL || 'https://apps.presencestag.com/admin',
        },
        apollo: {
            url: process.env.APOLLO_URL || 'https://workplace.presencestag.com/graphql/v1/',
        },
        apps: {
            url: process.env.APPS_URL || 'https://apps.presencestag.com',
            cookieDomain: process.env.APPS_COOKIE_DOMAIN || '.presencestag.com',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'https://apps.presencestag.com/components',
        },
        eduClients: {
            url: process.env.EDUCLIENTS_URL || 'https://apps.presencestag.com/c',
        },
        flutterApp: {
            url: process.env.FLUTTER_APP_URL || 'https://flutterapp.presencestag.com',
        },
        hamm: {
            url: process.env.HAMM_URL || 'https://apps.presencestag.com/c/billing',
        },
        help: {
            url: process.env.HELP_URL || 'https://presencelearning.helpjuice.com'
        },
        landing: {
            url: process.env.LANDING_URL || 'https://apps.presencestag.com/landing',
        },
        platform: {
            url: process.env.PLATFORM_URL || 'https://platform.presencestag.com',
        },
        library: {
            url: process.env.LIBRARY_URL || 'https://library.presencestag.com',
        },
        lightyear: {
            url: process.env.LIGHTYEAR_URL || 'https://room.presencestag.com',
        },
        room: {
            url: process.env.ROOM_URL || 'https://room.presencestag.com',
        },
        rex: {
            url: process.env.REX_URL || 'https://apps.presencestag.com/clients',
        },
        techcheck: {
            url: process.env.TECHCHECK_URL || 'https://setup.presencestag.com',
        },
        toychest: {
            url: process.env.TOYCHEST_URL || 'https://store.presencestag.com',
        },
        toys: {
            url: process.env.TOYS_URL || 'https://apps.presencestag.com',
        },
        woody: {
            url: process.env.WOODY_URL || 'https://apps.presencestag.com/c/schedule',
        },
    },
};
