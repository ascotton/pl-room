module.exports = {
    cookieDomain: 'localhost',
    heapKey: '',
    sentryKey: '',
    remoteHQSrc: 'presencelearningtest',
    // You must hack your host file to make the api key work
    speedOfMe: {
        key: 'SOM60d26a7e8aa1b'
    },
    // Uncomment to log to test:
    // heapKey: '4014912286',
    // sentryKey: 'https://4bcd2931b66e4dd0b5ab0b6d1942c712@sentry.io/1279984',
    liveagent: {
        "endpoint": "https://d.la1-c2cs-ia2.salesforceliveagent.com/chat",
        "buttonId":"57380000000GnQ2",
        "initArg1":"57280000000CbGq",
        "initArg2":"00D550000000OnL"
    },
    testDataCacheType: 'file',
    room: {
        inactiveSeconds: 3600,
        restoreQueueHardDeleteTime: 1,
        restoreQueueHardDeleteUnit: 'hours'
    },
    featureFlags: {
        sharedCursorTokbox: 0.25
    },
    apps: {
        apiJira: {
            url: process.env.APIJIRA_URL || 'https://platform.presencetest.com',
        },
        apiTechcheck: {
            url: process.env.APITECHCHECK_URL || 'https://techcheck.presencetest.com',
        },
        apiWorkplace: {
            url: process.env.APIWORKPLACE_URL || 'https://localhost:8001',
        },
        auth: {
            url: process.env.AUTH_URL || 'https://localhost:9001',
        },
        admin: {
            url: process.env.ADMIN_URL || 'https://apps.presencetest.com/admin',
        },
        apollo: {
            url: process.env.APOLLO_URL || 'https://localhost:8001/graphql/v1/',
        },
        apps: {
            url: process.env.APPS_URL || 'https://apps.presencetest.com',
            cookieDomain: process.env.APPS_COOKIE_DOMAIN || 'localhost',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'http://localhost:4200/components',
        },
        eduClients: {
            url: process.env.EDUCLIENTS_URL || 'http://localhost:3010/c',
        },
        flutterApp: {
            url: process.env.FLUTTER_APP_URL || 'http://localhost:3009',
        },
        hamm: {
            url: process.env.HAMM_URL || 'https://localhost:3007/c/billing',
        },
        help: {
            url: process.env.HELP_URL || 'https://presencelearning.helpjuice.com'
        },
        landing: {
            url: process.env.LANDING_URL || 'http://localhost:3010/c',
        },
        learning: {
            url: process.env.LEARNING_URL || 'https://localhost:8021',
        },
        library: {
            url: process.env.LIBRARY_URL || 'http://localhost:3000',
        },
        lightyear: {
            url: process.env.LIGHTYEAR_URL || 'http://localhost:3001',
        },
        room: {
            url: process.env.ROOM_URL || 'http://localhost:3013',
        },
        rex: {
            url: process.env.REX_URL || 'http://localhost:3003/clients',
        },
        techcheck: {
            url: process.env.TECHCHECK_URL || 'http://localhost:3004',
        },
        toychest: {
            url: process.env.TOYCHEST_URL || 'http://localhost:3000',
        },
        toys: {
            url: process.env.TOYS_URL || 'http://localhost:3002',
        },
        woody: {
            url: process.env.WOODY_URL || 'https://localhost:3006/schedule',
        },
    },
};
