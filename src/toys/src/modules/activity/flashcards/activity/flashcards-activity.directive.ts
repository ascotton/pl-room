let FlashcardsActivityDirective;
FlashcardsActivityDirective = function FlashcardsActivityDirective() {
    return {
        restrict: 'E',
        controller: 'FlashcardsController',
        scope: {},
        template: require('./flashcards-activity.directive.html'),
    };
};

import * as angular from 'angular';

const flashcardsActivityDirective = angular.module('toys').directive('flashcardsActivity', [
    FlashcardsActivityDirective,
]);
