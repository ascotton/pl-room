let wjAudioAssessmentDirective;
wjAudioAssessmentDirective = function wjAudioAssessmentDirective(firebaseAppModel) {
    return {
        restrict: 'E',
        controller: 'wjAudioAssessmentController',
        scope: {},
        template: require('./wj-audio-assessment.html'),

        link: ($scope, element, attrs) => {
            $scope.hideAudioPlayer = () => {
                if (firebaseAppModel) {
                    if (firebaseAppModel.app.layoutMode) {
                        return firebaseAppModel.app.layoutMode !== 'compact';
                    }
                    // handle legacy layout flag
                    return firebaseAppModel.app.fullscreen !== 'normal';
                } else {
                    return false;
                }
            }
        },
    };
};

import * as angular from 'angular';

const wjAudioAssessment = angular.module('toys').directive('wjAudioAssessment', [
    'firebaseAppModel',
    wjAudioAssessmentDirective,
]);
