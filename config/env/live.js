module.exports = {
    cookieDomain: 'presencelearning.com',
    heapKey: '881309070',
    sentryKey: 'https://c7dc185256c24e06a3f97b26d77b50eb@sentry.io/1398728',
    remoteHQSrc: 'presencelearning',
    speedOfMe: {
        key: 'SOM56b3b6dd9be9b'
    },
    liveagent: {
        "endpoint": "https://d.la4-c1-chi.salesforceliveagent.com/chat",
        "buttonId":"57380000000GnQ2",
        "initArg1":"57280000000CbGq",
        "initArg2":"00D80000000aMap"
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
            url: process.env.APIJIRA_URL || 'https://platform.presencelearning.com',
        },
        apiTechcheck: {
            url: process.env.APITECHCHECK_URL || 'https://techcheck.presencelearning.com',
        },
        apiWorkplace: {
            url: process.env.APIWORKPLACE_URL || 'https://workplace.presencelearning.com',
        },
        auth: {
            url: process.env.AUTH_URL || 'https://login.presencelearning.com',
        },
        admin: {
            url: process.env.ADMIN_URL || 'https://apps.presencelearning.com/admin',
        },
        apollo: {
            url: process.env.APOLLO_URL || 'https://workplace.presencelearning.com/graphql/v1/',
        },
        apps: {
            url: process.env.APPS_URL || 'https://apps.presencelearning.com',
            cookieDomain: process.env.APPS_COOKIE_DOMAIN || '.presencelearning.com',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'https://apps.presencelearning.com/components'
        },
        eduClients: {
            url: process.env.EDUCLIENTS_URL || 'https://apps.presencelearning.com/c',
        },
        flutterApp: {
            url: process.env.FLUTTER_APP_URL || 'https://flutterapp.presencelearning.com',
        },
        hamm: {
            url: process.env.HAMM_URL || 'https://apps.presencelearning.com/c/billing',
        },
        help: {
            url: process.env.HELP_URL || 'https://presencelearning.helpjuice.com'
        },
        landing: {
            url: process.env.LANDING_URL || 'https://apps.presencelearning.com/landing',
        },
        platform: {
            url: process.env.PLATFORM_URL || 'https://platform.presencelearning.com',
        },
        library: {
            url: process.env.LIBRARY_URL || 'https://library.presencelearning.com',
        },
        lightyear: {
            url: process.env.LIGHTYEAR_URL || 'https://room.presencelearning.com',
        },
        room: {
            url: process.env.ROOM_URL || 'https://room.presencelearning.com',
        },
        rex: {
            url: process.env.REX_URL || 'https://apps.presencelearning.com/clients',
        },
        techcheck: {
            url: process.env.TECHCHECK_URL || 'https://setup.presencelearning.com',
        },
        toychest: {
            url: process.env.TOYCHEST_URL || 'https://store.presencelearning.com',
        },
        toys: {
            url: process.env.TOYS_URL || 'https://apps.presencelearning.com',
        },
        woody: {
            url: process.env.WOODY_URL || 'https://apps.presencelearning.com/c/schedule',
        },
    },
};
