let PdfActivityDrawerDirective;
PdfActivityDrawerDirective = function PdfActivityDrawerDirective() {
    return {
        restrict: 'E',
        controller: 'PdfViewerDrawerController',
        scope: {},
        template: require('./pdf-activity-drawer.directive.html'),
    };
};

import * as angular from 'angular';

const pdfActivityDrawerDirective = angular.module('toys').directive('pdfActivityDrawer', [
    PdfActivityDrawerDirective,
]);
