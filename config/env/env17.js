module.exports = {
    cookieDomain: 'localhost',
    heapKey: '',
    sentryKey: '',
    remoteHQSrc: 'presencelearningtest',
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
            url: process.env.APIJIRA_URL || 'https://env17-platform.presencek8s.com',
        },
        apiTechcheck: {
            url: process.env.APITECHCHECK_URL || 'https://env17-techcheck.presencek8s.com',
        },
        apiWorkplace: {
            url: process.env.APIWORKPLACE_URL || 'https://env17-workplace.presencek8s.com',
        },
        auth: {
            url: process.env.AUTH_URL || 'https://env17-login.presencek8s.com',
        },
        admin: {
            url: process.env.ADMIN_URL || 'https://env17-apps.presencek8s.com/admin',
        },
        apollo: {
            url: process.env.APOLLO_URL || 'https://env17-workplace.presencek8s.com/graphql/v1/',
        },
        apps: {
            url: process.env.APPS_URL || 'https://env17-apps.presencek8s.com',
            cookieDomain: process.env.APPS_COOKIE_DOMAIN || '.presencek8s.com',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'https://env17-apps.presencek8s.com/components',
        },
        eduClients: {
            url: process.env.EDUCLIENTS_URL || 'https://env17-apps.presencek8s.com/c',
        },
        flutterApp: {
            url: process.env.FLUTTER_APP_URL || 'https://env17-flutterapp.presencek8s.com',
        },
        hamm: {
            url: process.env.HAMM_URL || 'https://env17-apps.presencek8s.com/c/billing',
        },
        help: {
            url: process.env.HELP_URL || 'https://presencelearning.helpjuice.com'
        },
        landing: {
            url: process.env.LANDING_URL || 'https://env17-apps.presencek8s.com/landing',
        },
        platform: {
            url: process.env.PLATFORM_URL || 'https://env17-platform.presencek8s.com',
        },
        library: {
            url: process.env.LIBRARY_URL || 'https://env17-library.presencek8s.com',
        },
        lightyear: {
            url: process.env.LIGHTYEAR_URL || 'https://env17-room.presencek8s.com',
        },
        room: {
            url: process.env.ROOM_URL || 'https://env17-room.presencek8s.com',
        },
        rex: {
            url: process.env.REX_URL || 'https://env17-apps.presencek8s.com/clients',
        },
        techcheck: {
            url: process.env.TECHCHECK_URL || 'https://env17-setup.presencek8s.com',
        },
        toychest: {
            url: process.env.TOYCHEST_URL || 'https://env17-store.presencek8s.com',
        },
        toys: {
            url: process.env.TOYS_URL || 'https://env17-apps.presencek8s.com',
        },
        woody: {
            url: process.env.WOODY_URL || 'https://env17-apps.presencek8s.com/c/schedule',
        },
    },
};
