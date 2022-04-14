let PdfActivityDirective;
PdfActivityDirective = function PdfActivityDirective() {
    return {
        restrict: 'E',
        controller: 'pdfActivityController',
        scope: {},
        template: require('./pdf-activity.directive.html'),
    };
};

import * as angular from 'angular';

const pdfActivityDirective = angular.module('toys').directive('pdfActivity', [
    PdfActivityDirective,
]);
