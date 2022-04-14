const YoutubeController = function($log, $scope, $stateParams) {

    function init() {
        $log.debug('YouTubeController init');
    }
    init();
};

import * as angular from 'angular';
const youtubeController = angular.module('toys').controller('youtubeController', [
    '$log', '$scope', '$stateParams',
    YoutubeController,
]);
