function plDrag($timeout) {
    return {
        restrict: 'A',
        scope: {
            plDrag: '=',
            plDragData: '=',
            plDragNoDigest: '=',
        },
        link: (scope, element) => {
            element[0].draggable = true;
            element[0].addEventListener('dragstart', (event) => {
                scope.plDrag(event, scope.plDragData);
            },                          false);
        },
    };
}

import * as angular from 'angular';

const activityDrawer = angular.module('toys').directive('plDrag', [
    '$timeout',
    plDrag,
]);
