let YoutubeActivityDirective;
YoutubeActivityDirective = function YoutubeActivityDirective() {
    return {
        restrict: 'E',
        controller: 'youtubeController',
        scope: {},
        template: require('./youtube-activity.directive.html'),
    };
};

import * as angular from 'angular';

const youtubeActivity = angular.module('toys').directive('youtubeActivity', [
    YoutubeActivityDirective,
]);
