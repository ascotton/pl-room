const YoutubeActivityDrawerController = function($log, $scope, $stateParams, activityModel) {
    activityModel.foundationLoaded.then((result) => {
        $scope.description = result.configModel.model.description;
    });
    $scope.activity = activityModel.activity;
    $scope.send = function() {
        activityModel.channel.call({
            method: 'play',
            success: (v) => {
            },
        });
    };
    function init() {
        $log.debug('Youtube Controller');
    }
    init();
};

import * as angular from 'angular';
const youtubeActivityDrawerController = angular.module('toys').controller('YoutubeActivityDrawerController', [
    '$log', '$scope', '$stateParams', 'activityModel',
    YoutubeActivityDrawerController,
]);
