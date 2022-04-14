let MemoryActivityDirective;
MemoryActivityDirective = function MemoryActivityDirective() {
    return {
        restrict: 'E',
        controller: 'MemoryController',
        scope: {},
        template: require('./memory-activity.directive.html'),
    };
};

import * as angular from 'angular';

const memoryActivityDirective = angular.module('toys').directive('memoryActivity', [
    MemoryActivityDirective,
]);
