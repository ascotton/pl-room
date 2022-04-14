var NotifyDirective = function($timeout) {
    return {
        replace: true,
        restrict: 'E',
        template : require('./notify.directive.html'),
        scope: {},
        link: function ($scope, $element, $attr) {
            $scope.message = $attr.message;
            var timeout = 1000;
            var delay = 5000;
            if($attr.hasOwnProperty('timeout')){
                timeout = parseInt($attr.timeout);
            }
            if($attr.hasOwnProperty('delay')){
                delay = parseInt($attr.delay);
            }

            var height = $element.outerHeight(true);
            $timeout(function(){
                $element.animate({top: -height}, timeout);
            }, delay);
        }
    };
};

import { commonDirectivesModule } from '../common-directives.module';
commonDirectivesModule.directive('plNotify', ['$timeout', NotifyDirective]);
