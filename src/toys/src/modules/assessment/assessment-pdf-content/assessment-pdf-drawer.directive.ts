/**
 * Created by bohdanivanov on 5/25/16.
 */
let AssessmentPDFDrawerDirective;
AssessmentPDFDrawerDirective = function AssessmentPDFDrawerDirective(
    $timeout, AssessmentModel, currentUserModel, hotkeys) {
    return {
        restrict: 'E',
        controller: 'assessmentPDFDrawerController',
        scope: {},
        template: require('./assessment-pdf-drawer.directive.html'),
        link: ($scope) => {
            if (!currentUserModel.user.isAssessmentUser()) {
                return;
            }
            const hotkeysConfig = [{
                combo: 'space',
                action: 'keydown',
                description: 'Show/hide instructions',
                callback: (event) => {
                    if (!checkElement(event.target)) {
                        return;
                    }
                    showHideInstruction(true);
                    event.preventDefault();
                },
            }, {
                combo: 'space',
                action: 'keyup',
                callback: () => showHideInstruction(false),
            }, {
                combo: 'up',
                description: 'Jump to previous page',
                callback: () => {
                    AssessmentModel.channel.call({
                        method: 'prev',
                    });
                },
            }, {
                combo: 'down',
                description: 'Jump to next page',
                callback: () => {
                    AssessmentModel.channel.call({
                        method: 'next',
                    });
                },
            }];
            $scope.assessmentModel = AssessmentModel;
            const editableElements = ['textarea', 'input'];

            const checkElement = (element) => {
                const isEditableElement = -1 !== editableElements.indexOf(element.tagName.toLowerCase());
                if (isEditableElement || 'true' === element.contentEditable) {
                    return false;
                }
                return true;
            };

            const showHideInstruction = (status) => {
                if ($scope.isDoubleSided && status !== AssessmentModel.getShowInstructions()) {
                    // timeout is needed for pdfjs to measure its viewport properly
                    $timeout(() => {
                        AssessmentModel.saveInstructionsVisible(status);
                    });
                }
            };

            $scope.$on('$destroy', () => {
                hotkeysConfig.forEach(item => hotkeys.del(item.combo));
            });

            hotkeysConfig.forEach(item => hotkeys.add(item));
        },
    };
};

import * as angular from 'angular';

const assessmentPDFDrawerDirective = angular.module('toys').directive('assessmentPdfDrawer', [
    '$timeout', 'AssessmentModel', 'currentUserModel', 'hotkeys',
    AssessmentPDFDrawerDirective,
]);
