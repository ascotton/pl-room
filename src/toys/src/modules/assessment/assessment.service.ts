/**
 * Equivalent to ActivityService but using AssessmentModel instead of ActivityModel
 */

export class AssessmentService {
    constructor (private $log, $rootScope, $location, private AssessmentModel, private guidService) {

    }
    startup(activity, token = null) {
        if (activity.id === this.AssessmentModel.activity.activityId) {
            return this.AssessmentModel.foundationLoaded;
        }
        this.reset();
        this.$log.debug('[AssessmentService] startup');
        this.AssessmentModel.setActivityId(activity.id);
        this.AssessmentModel.setConfigId(activity.slug);
        this.AssessmentModel.setType(activity.resource_type);
        const shareId = activity.session_id;
        if (shareId) {
            // enable firebase
            this.AssessmentModel.setSessionId(shareId);
            this.AssessmentModel.setShared(true);
            this.$log.debug('[AssessmentService] sharing enabled.');
        } else {
            // skip firebase
            this.AssessmentModel.setSessionId(this.guidService.generateUUID());
            this.AssessmentModel.setShared(false);
            this.$log.debug('[AssessmentService] sharing disabled.');
        }
        this.AssessmentModel.initialize({}, token);
        return this.AssessmentModel.foundationLoaded;
    }

    reset() {
        this.AssessmentModel.reset();
    }
}

import * as angular from 'angular';

const assessmentService = angular.module('toys').service('assessmentService', [
    '$log', '$rootScope', '$location', 'AssessmentModel', 'guidService',
    AssessmentService,
]);
