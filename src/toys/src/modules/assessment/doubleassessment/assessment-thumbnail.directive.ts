import * as angular from 'angular';

const AssessmentThumbnailDirective = function ($log, $q, $window, $timeout, $compile, $stateParams) {
    return {
        restrict: 'E',
        scope : {
            pagenum : '=',
            isdouble : '=',
            thumb : '=',
        },
        template: require('./assessment-thumbnail.directive.html'),

        link: (scope, element, attrs) => {
            scope.jump = function (pageNum, evt) {
                $log.debug('[AssessmentThumbnailDirective] jump: ' + pageNum);
            };
        },
    };
};

const assessmentThumbnailDirective = angular.module('toys').directive('assessmentThumbnail', [
    '$log', '$q', '$window', '$timeout', '$compile', '$stateParams',
    AssessmentThumbnailDirective,
]);
