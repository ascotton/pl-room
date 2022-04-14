const ImageOnLoadDirective = function () {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            element.bind('load', () => {
                // call the function that was passed
                scope.$evalAsync(attrs.imageOnLoad);
            });
        },
    };
};

import * as angular from 'angular';

const imageOnLoad = angular.module('toys').directive('imageOnLoad', [
    '$log', '$document',
    ImageOnLoadDirective,
]);
