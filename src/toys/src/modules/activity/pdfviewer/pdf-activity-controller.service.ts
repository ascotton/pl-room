class PDFActivityController {
    constructor ($log) {
        $log.debug('PDFActivityController init');
    }
}

export default PDFActivityController;

import * as angular from 'angular';
const pdfActivityController = angular.module('toys').controller('pdfActivityController', [
    '$log',
    PDFActivityController,
]);
