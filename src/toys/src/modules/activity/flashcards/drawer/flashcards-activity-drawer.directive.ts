let FlashcardsActivityDrawerDirective;
FlashcardsActivityDrawerDirective = function FlashcardsActivityDrawerDirective() {
    return {
        restrict: 'E',
        controller: 'FlashcardsDrawerController',
        scope: {},
        template: require('./flashcards-activity-drawer.directive.html'),
    };
};

import * as angular from 'angular';

const flashcardsActivityDrawer = angular.module('toys').directive('flashcardsActivityDrawer', [
    FlashcardsActivityDrawerDirective,
]);
