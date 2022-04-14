let PlWindowWarning;
PlWindowWarning = function(liveagentService, $rootScope, iPadService) {
    'use strict';
    const minWidth = 800;
    const minHeight = 600;
    return {
        restrict: 'E',
        transclude: true,
        template: require('./pl-window-warning.directive.html'),
        scope: {
            width: '=?',
            height: '=?'
        },
        link: function(scope) {

            scope.width = scope.width || minWidth;
            scope.height = scope.height || minHeight;
            scope.liveagent = liveagentService;
            scope.isIPad = iPadService.isIPad();

            $(window).on('resize', () => {
                scope.$evalAsync(() => {
                    scope.windowWidth = $(window).width();
                    scope.windowHeight = $(window).height();
                    // scope.windowTooSmall = scope.windowWidth < scope.width || scope.windowHeight < scope.height;
                    scope.windowPortraitMode = scope.isIPad && scope.windowWidth < scope.windowHeight;
                    // $rootScope.$broadcast('windowResizeTooSmall', { windowTooSmall: scope.windowTooSmall });
                });
            });
        },
    };
};

import { commonDirectivesModule } from '../common-directives.module';
const plWindowWarning = commonDirectivesModule.directive('plWindowWarning', [
    'liveagentService', '$rootScope', 'iPadSupportService', PlWindowWarning,
]);

