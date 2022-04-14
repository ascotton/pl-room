const DoubleAssessmentActivityController = function ($log) {
    function init() {
        $log.debug('[DoubleAssessmentController] init');
    }
    init();
};

import * as angular from 'angular';
const doubleAssessmentActivityController = angular.module('toys').controller('DoubleAssessmentActivityController', [
    '$log',
    DoubleAssessmentActivityController,
]);
