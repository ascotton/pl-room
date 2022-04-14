import { isFunction } from 'lodash';

function plDrop($timeout) {
    return {
        restrict: 'A',
        scope: {
            plDrop: '=',
            plDragover: '=',
            plDragend: '=',
            plDragcancel: '=',
            plDragData: '=',
        },
        link: (scope, element, attrs) => {
            let dropped = false;
            element[0].addEventListener('dragover', (e) => {
                dropped = false;
                e.preventDefault();
                if (isFunction(scope.plDragover)) {
                    scope.plDragover(e);
                }
            },                          false);
            element[0].addEventListener('drop', (e) => {
                scope.plDrop(e, scope.plDragData);
                dropped = true;
            },                          false);
            element[0].addEventListener('dragend', (e) => {
                if (isFunction(scope.plDragend)) {
                    scope.plDragend(e, scope.plDragData);
                }

                if (dropped === false && isFunction(scope.plDragcancel)) {
                    scope.plDragcancel(e, scope.plDragData);
                }
            },                          false);
        },
    };
}

import * as angular from 'angular';

const plDropDirective = angular.module('toys').directive('plDrop', [
    '$timeout',
    plDrop,
]);
