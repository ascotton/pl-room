import { bind } from 'lodash';
import { ActivityModel } from '../activity/activity-model.service';

/**
  * AssessmentModel extends ActivityModel with assessment specific functionality, starting
  * with instructions.
  */

class AssessmentModel extends ActivityModel {
    pageRef: any;
    preferencesRef: any;

    DEFAULT_SCROLL_X = 0;
    DEFAULT_SCROLL_Y = 0;
    DEFAULT_OPACITY = 0.6;

    callbackRegistry: any = new Set();

    allowToggleInstructions = true;
    showInstructions = false;
    instructionOpacity = 0.6;

    scrollXPercent = 0;
    scrollYPercent = 0;
    session: any;

    constructor($log, $q, $timeout, drfActivityModel, drfAssessmentModel,
                firebaseModel,
                private dispatcherService, private currentUserModel, private rightsMgmtService, ChannelService,
                applications, $http) {
        super($log, $q, $timeout, firebaseModel, drfActivityModel, drfAssessmentModel,  ChannelService,
            applications, $http);
        this.showInstructions = this.getDefaultShowInstructions();

    }

    /***************************
     * overridden functions
     ***************************/
    reset() {
        this.$log.debug('[AssessmentModel] reset');
        this.clearCallbackRegistry(); // this must be before any persisted value changes

        this.allowToggleInstructions = true;
        this.showInstructions = this.getDefaultShowInstructions();
        this.instructionOpacity = 0.6; // default

        return super.reset(); // this must be last
    }

    initialize(model, token = null) {
        return super.initialize(model, token=token);
    }

    /***************************
     * rights mgmt
     ***************************/

    getProtectedContentUrl(key) {
        this.$log.debug('[AssessmentModel] getProtectedContentUrl');
        return this.rightsMgmtService.getProtectedContentUrl(this.getActivityId(), key);
    }

    cachedProtectedAsset(key) {
        return this.rightsMgmtService.assets[key];
    }

    /***************************
     * instruction visibility
     ***************************/
    toggleInstructions() {
        if (this.canUserAccessInstructions()) {
            this.saveInstructionsVisible(!this.showInstructions);
        }
    }

    getDefaultShowInstructions() {
        if (this.currentUserModel && this.currentUserModel.user && this.currentUserModel.user.isAssessmentUser()) {
            return true;
        }
        return false;
    }

    setShowInstructions(value) {
        if (this.canUserAccessInstructions()) {
            this.showInstructions = value;
        }
    }

    getShowInstructions() {
        return this.showInstructions;
    }

    canUserAccessInstructions() {
        return this.currentUserModel.user.isAssessmentUser();
    }

    setInstructionOpacity(value) {
        this.$log.debug('[AssessmentModel] setting instructionOpacity: ' + value);
        this.instructionOpacity = value;
    }

    getInstructionOpacity() {
        return this.instructionOpacity;
    }

    setScrollXPercent(value) {
        this.$log.debug('[AssessmentModel] setting scrollXPercent: ' + value);
        this.scrollXPercent = value;
    }

    getScrollXPercent() {
        return this.scrollXPercent;
    }

    setScrollYPercent(value) {
        this.$log.debug('[AssessmentModel] setting scrollYPercent: ' + value);
        this.scrollYPercent = value;
    }

    getScrollYPercent() {
        return this.scrollYPercent;
    }

    /***************************
     * firebase mutation methods
     ***************************/
    saveScrollPosition(scrollX, scrollY) {
        try {
            this.pageRef.update({ scrollXPercent: scrollX, scrollYPercent: scrollY });
        } catch (err) {
            this.$log.debug('[AssessmentModel] Error in saveScrollPosition: ', err)
        }
    }

    saveOpacity(val) {
        this.preferencesRef.child('instructionsOpacity').set(val);
    }

    saveInstructionsVisible(val) {
        this.preferencesRef.child('instructionsVisible').set(val);
    }

    saveZoom(value) {
        this.pageRef.child('zoom').set(value);
    }

    savePage(page) {
        try {
            this.pageRef.update(page);
        } catch (err) {
            this.$log.debug('[AssessmentModel] Error in savePage: ', err)
        }
    }

    /***************************
     * firebase listeners
     ***************************/
    loadState() {

        this.preferencesRef = this.firebaseModel.getFirebaseRef(
            `activities/sessions/${this.getSessionId()}/${this.activity.configId}/preferences`,
        );

        this.pageRef = this.firebaseModel.getFirebaseRef(
            `activities/sessions/${this.getSessionId()}/${this.activity.configId}/pageNum`,
        );

        const eventType = 'value';

        let ref = this.pageRef;
        this.registerCallback(ref, eventType, ref.on(eventType, this.handlePageChange, this), null);

        ref = this.preferencesRef.child('instructionsOpacity');
        this.registerCallback(ref, eventType, ref.on(eventType, this.handleOpacityChange, this), null);

        ref = this.preferencesRef.child('instructionsVisible');
        this.registerCallback(ref, eventType, ref.on(eventType, this.handleInstructionsChange, this), null);

        ref = this.pageRef.child('zoom');
        this.registerCallback(ref, eventType, ref.on(eventType, this.handleZoomChange, this), null);

        ref = this.pageRef.child('offset');
        this.registerCallback(ref, eventType, ref.on(eventType, this.handleOffsetChange, this), null);

        ref = this.pageRef.child('scrollXPercent');
        this.registerCallback(ref, eventType, ref.on(eventType, this.handleScrollXPercent, this), null);

        ref = this.pageRef.child('scrollYPercent');
        this.registerCallback(ref, eventType, ref.on(eventType, this.handleScrollYPercent, this), null);
    }

    private handlePageChange(snap) {
        this.$log.debug('[AssessmentModel] handlePageChange');
        this.dispatchEvent(snap, snap.val(), 'value', 'pageChangeEvent');
    }

    private handleInstructionsChange(snap) {
        // Skip null values, which will evaluate to falsy.
        if (snap.val() !== null) {
            this.$log.debug('[AssessmentModel] handleInstructionsChange');
            this.setShowInstructions(snap.val());
            this.dispatchEvent(snap, this.getShowInstructions(), 'value', 'instructionsChangeEvent');
        }
    }

    private handleOpacityChange(snap) {
        this.$log.debug('[AssessmentModel] handleOpacityChange');
        this.instructionOpacity = (snap.val() == null) ? this.DEFAULT_OPACITY : snap.val();
        this.dispatchEvent(snap, this.instructionOpacity, 'value', 'opacityChangeEvent');
    }

    private handleZoomChange(snap) {
        this.$log.debug('[AssessmentModel] handleOpacityChange');
        this.dispatchEvent(snap, snap.val(), 'value', 'zoomChangeEvent');
    }

    private handleOffsetChange(snap) {
        this.$log.debug('[AssessmentModel] handleOffsetChange');
        this.dispatchEvent(snap, snap.val(), 'value', 'offsetChangeEvent');
    }

    private handleScrollXPercent(snap) {
        this.$log.debug('[AssessmentModel] handleScrollXPercent');
        this.setScrollXPercent(this.getScrollXFromSnap(snap));
        this.dispatchEvent(snap, this.getScrollXPercent(), 'value', 'scrollXChangeEvent');
    }

    private handleScrollYPercent(snap) {
        this.$log.debug('[AssessmentModel] handleScrollYPercent');
        this.setScrollYPercent(this.getScrollYFromSnap(snap));
        this.dispatchEvent(snap, this.getScrollYPercent(), 'value', 'scrollYChangeEvent');
    }

    dispatchEvent(snap, data, srcType, targetType) {
        const event: any = {};
        event.type = srcType;
        event.data = data;
        event._snapshot = snap; // convenience
        this.dispatcherService.dispatch(targetType, null, event);
    }

    private registerCallback(ref, event, callback, context) {
        this.$log.debug('[AssessmentModel] adding ', event, 'to callback registry');
        this.callbackRegistry.add({ ref, event, callback, context });
    }

    /**
     * Clean up all firebase listeners that were registered.
     * @private
     */
    private clearCallbackRegistry() {
        if (!this.callbackRegistry) {
            this.callbackRegistry = new Set();
        }
        this.$log.debug('[AssessmentModel] clearing ', this.callbackRegistry.size, 'items from the callback registry');
        for (const item of this.callbackRegistry.values()) {
            try {
                item.ref.off(item.event, item.callback, this);
            } catch (error) {
                this.$log.debug('[AssessmentModel] removing callback from ref failed');
            }
        }
        this.callbackRegistry.clear();
        this.$log.debug('[AssessmentModel] callback registry size: ', this.callbackRegistry.size);
    }

    /***************************
     * util
     ***************************/
    private getValueFromSnap(snap, key, defaultValue) {
        const val = snap.val();
        let newVal = val || defaultValue;
        if (val !== null && typeof val === 'object') {
            newVal = val[key];
        }
        return newVal || defaultValue;
    }

    private getScrollXFromSnap(snap) {
        const scrollXPercent = this.getValueFromSnap(snap, this.fbScrollXPercentPath(), this.DEFAULT_SCROLL_X);
        return scrollXPercent;
    }

    private getScrollYFromSnap(snap) {
        const scrollYPercent = this.getValueFromSnap(snap, this.fbScrollYPercentPath(), this.DEFAULT_SCROLL_Y);
        return scrollYPercent;
    }

    private fbScrollXPercentPath() {
        return 'scrollXPercent';
    }

    private fbScrollYPercentPath() {
        return 'scrollYPercent';
    }

}

import * as angular from 'angular';

const assessmentModel = angular.module('toys').service('AssessmentModel', [
    '$log', '$q', '$timeout', 'drfActivityModel', 'drfAssessmentModel',
    'firebaseModel',
    'dispatcherService', 'currentUserModel', 'rightsMgmtService', 'ChannelService',
    'applications', '$http',
    AssessmentModel,
]);
