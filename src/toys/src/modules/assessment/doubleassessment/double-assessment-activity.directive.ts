import * as angular from 'angular';

const DoubleAssessmentActivityDirective = function() {
    return {
        restrict: 'E',
        controller: 'DoubleAssessmentActivityController',
        scope: {},
        template: require('./double-assessment-activity.directive.html'),
    };
};

const doubleAssessmentActivityDirective = angular.module('toys').directive('doubleAssessmentActivity', [
    DoubleAssessmentActivityDirective,
]);
