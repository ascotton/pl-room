
import * as moment from 'moment';
import * as PDFJS from 'pdfjs-dist';
import * as angular from 'angular';
import 'angular-hotkeys';

import '../build/config_ng1.js';
import './user-guiding.js';

import { downgradeModule } from './downgrade';
import { PLQueueModule } from './modules/pl-queue';
import { toysModule } from '../toys/src';
import { commonModelsModule } from './common/models';
import { commonServicesModule } from './common/services';
import { commonFactoriesModule } from './common/factories';
import { commonDirectivesModule } from './common/directives';
import { commonResolversModule } from './common/resolvers';
import { commonFiltersModule } from './common/filters';

import { roomModule } from './modules/room';
import { drawersModule } from './modules/room/drawers/index';
import { siteshareModule } from './modules/siteshare';
import { teamWriteModule } from './modules/team-write';

import { studentLoginModule } from './modules/student-login/index.ajs';
import { waitingRoomModule } from './modules/waiting-room/index.ajs';
import { plSetupModule } from './modules/pl-setup';

import 'ngtouch';

import * as Sentry from '@sentry/browser';

export const appModuleAngularJS = angular.module('room', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'LocalStorageModule',
    'ngRoute',
    'ui.router',
    'cfp.hotkeys',
    'ngTouch',

    studentLoginModule.name,
    waitingRoomModule.name,
    plSetupModule.name,
    roomModule.name,
    drawersModule.name,
    siteshareModule.name,
    teamWriteModule.name,

    downgradeModule.name,

    commonServicesModule.name,
    commonFactoriesModule.name,
    commonDirectivesModule.name,
    commonModelsModule.name,
    commonResolversModule.name,
    commonFiltersModule.name,

    'room.config',

    // PL shared libs
    PLQueueModule.name,
    toysModule.name,

]);

function appModuleConfig($stateProvider,
                         $logProvider,
                         $urlRouterProvider,
                         $resourceProvider,
                         $locationProvider,
                         $urlMatcherFactoryProvider,
                         flavor) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
    });
    $resourceProvider.defaults.stripTrailingSlashes = true;
    $urlMatcherFactoryProvider.strictMode(false);

    if (flavor !== 'live') {
        $logProvider.debugEnabled(true);
    }

    $urlRouterProvider.when('/newroom', '/');
    $urlRouterProvider.otherwise('/');

    // create root state
    $stateProvider
        .state('app', {
            abstract: true,
            url: '',
            template: '<ui-view></ui-view>',
        });
}

appModuleConfig.$inject = ['$stateProvider',
    '$logProvider',
    '$urlRouterProvider',
    '$resourceProvider',
    '$locationProvider',
    '$urlMatcherFactoryProvider',
    'flavor',
];
appModuleAngularJS.config(appModuleConfig);

// // If the user enters a URL that doesn't match any known URL (state), send them to `/welcome`
// const otherwiseConfigBlock = ['$urlRouterProvider', '$locationProvider', ($urlRouterProvider, $locationProvider) => {
//     $locationProvider.hashPrefix('');
//     // $urlRouterProvider.otherwise('/wizard');
//   }];
// appModuleAngularJS.config(otherwiseConfigBlock);

// Enable tracing of each TRANSITION... (check the javascript console)

// This syntax `$trace.enable(1)` is an alternative to `$trace.enable("TRANSITION")`.
// Besides "TRANSITION", you can also enable tracing for : "RESOLVE", "HOOK", "INVOKE", "UIVIEW", "VIEWCONFIG"
const traceRunBlock = ['$trace', ($trace) => { $trace.enable(1); }];
appModuleAngularJS.run(traceRunBlock);

// TODO - move this analytics configuration work to RemoteLoggingService, except we need a provider here
function AnalyticsConfig(analytics_conf) {
    //Heap configuration is now done by HeapLogger, which is instantiate in AppGlobalComponent

    if (analytics_conf.sentry !== '') {
        Sentry.init({
            dsn: analytics_conf.sentry,
            ignoreErrors: [
                'Unexpected token',
                'SyntaxError: expected expression, got \'<\'',
                'Cannot read property \'socketId\' of null',
                '10 $digest() iterations reached.',
                'TypeError: Cannot read property \'element\' of undefined',
                'Permission denied',
                'Non-Error promise rejection',
            ],
        });
    }
}
AnalyticsConfig.$inject = ['analytics_conf'];
appModuleAngularJS.config(AnalyticsConfig);

function authInterceptorConfig($httpProvider) {
    $httpProvider.interceptors.push([
        'authInterceptor',
        '$window',
        '$injector', (authInterceptor, $window, $injector) => {
            authInterceptor.onUnauthorized(() => {
                $injector.get('authenticationService')
                    .login();
            });
            return authInterceptor;
        },
    ]);
}
authInterceptorConfig.$inject = ['$httpProvider'];
appModuleAngularJS.config(authInterceptorConfig);

function localStorageConfig(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('lightyear');
}
localStorageConfig.$inject = ['localStorageServiceProvider'];
appModuleAngularJS.config(localStorageConfig);

function runFn($rootScope,
               sha,
               lastCommit,
               authenticationService,
               $window,
               roomnameModel,
               $stateParams,
               $state,
        // ChannelService,
               versions,
               plAppGlobal,
    ) {

    const Moment: any = moment;

    // set the default format for moment string rendering
    Moment.defaultFormat = 'YYYY-MM-DDTHH:mm:ss';

    // we use these to display in the toolbar in dev
    $rootScope.sha = sha;
    $rootScope.lastCommit = lastCommit;

    // pageTitle sets the html <title> text on route change
    $rootScope.pageTitle = 'PresenceLearning';

    PDFJS.workerSrc = `/js/pdfjs/${versions.pdfjs}/pdf.worker.js`;

    // Handle logout events
    authenticationService.onLogout(() => {
        // clean up the roomname
        roomnameModel.value = null;
    });

    authenticationService.afterLogout(() => {
        // if a student logged out from url '/:clinician_username', go back to student login
        // observer mode also has a clinician_username parameter; send observers to normal login

        if ($stateParams.clinician_username && !plAppGlobal.isObserverMode()) {
            $state.go('app.studentLogin', $stateParams);
            $window.location.reload();
        } else {
            authenticationService.redirectToAuth();
        }
    });
}
runFn.$inject = ['$rootScope',
    'sha',
    'lastCommit',
    'authenticationService',
    '$window',
    'roomnameModel',
    '$stateParams',
    '$state',
    //  'ChannelService',
    'versions',
    'plAppGlobal',
    'appConfigService',
];
appModuleAngularJS.run(runFn);
