let YoutubeActivityDrawerDirective;
YoutubeActivityDrawerDirective = function YoutubeActivityDrawerDirective() {
    return {
        restrict: 'E',
        controller: 'YoutubeActivityDrawerController',
        scope: {},
        template: require('./youtube-activity-drawer.directive.html'),
    };
};

import * as angular from 'angular';

const youtubeActivityDrawer = angular.module('toys').directive('youtubeActivityDrawer', [
    YoutubeActivityDrawerDirective,
]);
