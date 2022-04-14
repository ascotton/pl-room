let MemoryActivityDrawerDirective;
MemoryActivityDrawerDirective = function MemoryActivityDrawerDirective() {
    return {
        restrict: 'E',
        controller: 'memoryDrawerController',
        scope: {},
        template: require('./memory-activity-drawer.directive.html'),
    };
};

import * as angular from 'angular';

const memoryActivityDrawer = angular.module('toys').directive('memoryActivityDrawer', [
    MemoryActivityDrawerDirective,
]);
