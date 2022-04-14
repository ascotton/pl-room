const plTextOverflowDirective = function($timeout) {
    return {
        restrict: 'A',
        link: (scope, element) => {
            $timeout(() => {
                const textDiv = element.find('div');
                if (textDiv.prop('scrollHeight') > parseFloat(textDiv.css('max-height'))) {
                    element.addClass('overflows');
                }
            });
        },
    };
};

import * as angular from 'angular';

const plTextOverflow = angular.module('toys').directive('plTextOverflow', [
    '$timeout',
    plTextOverflowDirective,
]);
