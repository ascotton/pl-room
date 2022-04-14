let WjAudioAssessmentThumbnailDirective;
WjAudioAssessmentThumbnailDirective = function () {
    return {
        restrict: 'E',
        scope : {
            pagenum : '=',
            isdouble : '=',
        },
        template: require('./wj-audio-assessment-thumbnail.directive.html'),

        link: (scope, element, attrs) => {

            scope.jump = function (pageNum, evt) {
                console.log(pageNum);
            };
        },
    };
};

import * as angular from 'angular';

const wjAudioAssessmentThumbnail = angular.module('toys').directive('wjAudioAssessmentThumbnail', [
    '$timeout', 'AssessmentModel', 'currentUserModel', 'hotkeys',
    WjAudioAssessmentThumbnailDirective,
]);
