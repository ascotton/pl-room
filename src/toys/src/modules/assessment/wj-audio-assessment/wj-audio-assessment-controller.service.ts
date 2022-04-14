const WjAudioAssessmentController = function ($log, $scope, $stateParams, hotkeys, AssessmentModel, currentUserModel) {
    function init() {
        $log.debug('WjAudioAssessmentController init');
    }
    init();
};

import * as angular from 'angular';
const wjAudioAssessmentController = angular.module('toys').controller('wjAudioAssessmentController', [
    '$log', '$scope', '$stateParams', 'hotkeys', 'AssessmentModel', 'currentUserModel',
    WjAudioAssessmentController,
]);
