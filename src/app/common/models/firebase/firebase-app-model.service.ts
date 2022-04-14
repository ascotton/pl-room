import { AppActions } from '@room/app/store';
import { selectAtLeastOneStudent } from '@room/session/store';
import * as angular from 'angular';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

/**
 * Model that holds the state of the state of application controls and widgets
 * @param $log
 * @param $timeout
 * @param $firebaseModel
 */
export class FirebaseAppModel {
    private activeActivityChange$ = new BehaviorSubject<any>('');
    activeActivityChanged = this.activeActivityChange$.asObservable();
    ready = false;

    /**
     * Application state properties
     * @type {{commsMode: string, whiteboardActive: boolean, documentationActive: boolean, reward: null,
     *  reward_last_changed: null, bigVideoId: number, sharingMyScreen: boolean, screenShareFailed: boolean,
     *  screenShareSupported: boolean}}
     */
    readonly defaults = {
        whiteboardActive: false, // TODO fix disappearing wb button if false
        sessionRecordDrawerActive: false,
        teamWriteActive: false,
        gamesActive: false,
        widgetsboardActive: false,
        reward: null,
        reward_last_changed: null,
        activeActivity: null,
        previousActiveActivity: null,
        guessWhoActive: false,
        screenshareActive: false,
        activitiesActive: false,
        compactMode: false,
        fullscreen: 'normal',
        whiteScreenActive: false,
        sharedCursorOn: false,
        audioLevelsOn: false,
        activeQueueId: null,
        shouldShowWorkspace: true,
        sameSiteUrl: '',
        remoteHQUrl: '',
        promotedPersonas: {},
        tokboxIsRecording: false,
        tokboxRecordingProperties: null,
        sessionRecordingViewerActive: false,
        sessionRecordingVideo: {},
        status: 'ready',
        atLeastOneStudent: false,
        siteshareActive: false,
        remoteHQActive: false,
    };

    app: any = this.defaults;
    ref: any;
    lastActiveActivity: any;

    constructor($log, private $timeout, private firebaseModel, private dispatcherService,
                private angularCommunicatorService, private ngrxStoreService) {
        ngrxStoreService.select(selectAtLeastOneStudent).subscribe((atLeastOneStudent) => {
            this.app.atLeastOneStudent = !!atLeastOneStudent;
        });
        this.ref = firebaseModel.getFirebaseRef('app');
        this.onStatus();
        this.onChanges();
        this.setupHandlers();
    }

    setupHandlers = () => {
        this.ref.on('value', this.onValue);
        this.ref.on('child_changed', this.onChanged);
        this.ref.on('child_removed', this.onChildRemoved);
    }

    onStatus = ()  => {
        this.firebaseModel.getFirebaseRef('status').on('value', (snapshot) => {
            // If not set, set to ready.
            this.app.status = snapshot.val() || 'ready';
            if (this.app.status === 'moved') {
                location.reload();
            }
        });
    }

    onChanges = () => {
        this.firebaseModel.getFirebaseRef('app/whiteboardActive').on('value', (snap) => {
            if (snap !== this.app.whiteboardActive) {
                this.angularCommunicatorService.onWorkspaceWhiteboardChange();
            }
            this.updateStore();
        });
    }

    setFullscreen = (mode) => {
        this.app.fullscreen = mode;
        this.ref.update({
            fullscreen: mode,
        });
    }

    setTokboxIsRecording = (value) => {
        this.app.tokboxIsRecording = value;

        this.ref.update({
            tokboxIsRecording: value,
        });
    }

    /**
     * value should be: { clientIDs: payload.clientIDs, record: payload.record }
     */
    setTokboxRecordingProperties = (value) => {
        this.app.tokboxRecordingProperties = value;
        this.ref.update({
            tokboxRecordingProperties: value,
        });
    }

    setSessionRecordingViewerActive = (value) => {
        this.app.sessionRecordingViewerActive = value;

        this.ref.update({
            sessionRecordingViewerActive: value,
        });
    }

    setSessionRecordingVideo = (value) => {
        this.app.sessionRecordingVideo = value;

        this.ref.update({
            sessionRecordingVideo: {
                url: value.url,
                formattedDate: value.formattedDate,
            },
        });
    }

    setGuessWhoActive = (value) => {
        this.app.guessWhoActive = value;

        this.ref.update({
            guessWhoActive: value,
        });
    }

    setPromotedPersonas = (guids) => {
        this.app.promotedPersonas = {};
        for (let i = 0; i < guids.length; i++) {
            this.app.promotedPersonas[guids[i]] = true;
        }
        this.ref.child('promotedPersonas').set(this.app.promotedPersonas);
    }

    promotePersona = (guid) => {
        if (this.app.promotedPersonas === null) {
            this.app.promotedPersonas = {};
        }
        this.app.promotedPersonas[guid] = true;
        const data = {};
        data[guid] = true;
        this.ref.child('promotedPersonas').update(data);
    }

    demotePersona = (guid) => {
        if (this.app.promotedPersonas === null) {
            this.app.promotedPersonas = {};
        }
        delete this.app.promotedPersonas[guid];
        this.ref.child('promotedPersonas').child(guid).remove();
    }

    setFullscreenBighead = (guid) => {
        this.app.bighead = guid;
        this.ref.update({
            bighead: guid,
        });
    }

    setWhiteScreenActive = (value) => {
        this.app.whiteScreenActive = value;
        this.ref.update({
            whiteScreenActive: value,
        });
    }

    setAtLeastOneStudent = (value) => {
        // In case student entered or left, need to re-check.
        if (this.app.atLeastOneStudent !== value) {
            // No student any more.
            if (!value) {
                if (this.app.activitiesActive && this.onAssessment()) {
                    this.setSharedCursorOn(this.app.sharedCursorOn, 0);
                }
            // At least one student.
            } else {
                if (this.app.activitiesActive && this.onAssessment()) {
                    this.setSharedCursorOn(true, 1);
                }
            }
        }
        this.app.atLeastOneStudent = value;
    }

    setAudioLevelsOn = (value) => {
        this.app.audioLevelsOn = value;
        this.ref.update({
            audioLevelsOn: value,
        });
    }

    setSharedCursorOn = (value, disableToggle = 0) => {
        this.app.sharedCursorOn = value;

        this.ngrxStoreService.dispatch(
            AppActions.setCursorSharing({ isCursorShared: value, isToggleDisabled: !!disableToggle }),
        );
    }

    setChatMuted = (value) => {
        this.app.chatIsMuted = value;
        this.ref.update({
            chatIsMuted: value,
        });
    }

    /**
     * setWhiteboardActive
     * @param active
     */
    setWhiteboardActive = (active) => {
        this.app.whiteboardActive = active;
        this.ref.update({
            whiteboardActive: active,
        });
    }

    /**
     * setGroupWriterActive
     * @param active
     */
    setTeamWriteActive = (active) => {
        if (active !== this.app.teamWriteActive) {
            if (active) {
                // Disallow shared cursor with team write (since team write scrolling makes cursor position incorrect).
                this.setSharedCursorOn(false, 1);
            } else if (!this.onAssessment()) {
                this.setSharedCursorOn(false, 0);
            }
        }
        this.app.teamWriteActive = active;
        this.ref.update({
            teamWriteActive: active,
        });
    }

    setGamesActive = (active) => {
        this.app.gamesActive = active;
        this.ref.update({
            gamesActive: active,
        });
    }

    onAssessment = () => {
        if (this.app.activeActivity && this.app.activeActivity.activity_type === 'assessment') {
            return true;
        }
        return false;
    }

    isAssessmentActive = () => {
        if (this.onAssessment() && this.app.activitiesActive) {
            return true;
        }
        return false;
    }

    setActivitiesActive = (active) => {
        if (active && this.onAssessment()) {
            const disableToggle = this.app.atLeastOneStudent ? 1 : 0;
            this.setSharedCursorOn(true, disableToggle);
        }
        if (active !== this.app.activitiesActive) {
            this.app.activitiesActive = active;
            this.ref.update({
                activitiesActive: active,
            });
        }
    }

    /**
     * setSessionRecordDrawerActive
     * @param active
     */
    setSessionRecordDrawerActive = (active) => {
        this.app.sessionRecordDrawerActive = active;
        this.ref.update({
            sessionRecordDrawerActive: active,
        });
    }

    /**
     *  setWidgetboardStatus
     *  @param active
     */
    setWidgetboardStatus = (active) => {
        this.app.widgetsboardActive = active;
        this.ref.update({
            widgetsboardActive: active,
        });
    }

    /**
     *  shouldShowWorkspace
     *  @param {Boolean} value
     */
    showWorkspace = (value) => {
        this.app.shouldShowWorkspace = value;
        this.ref.update({
            shouldShowWorkspace: value,
        });
    }

    /**
     *  setActiveActivity
     *  @param activityName
     */
    setActiveActivity = (activity) => {
        if (!this.ready) {
            return;
        }
        let activityChanged = false;
        if (this.isActivityChanged(activity)) {
            activityChanged = true;
            this.lastActiveActivity = activity;
        }
        if (this.app.activeActivity) {
            this.app.previousActiveActivity = this.app.activeActivity;
        }

        this.ref.update({
            previousActiveActivity: null,
        });

        if (!activity) {
            this.ref.update({
                activeActivity: null,
            });

            if (activityChanged) {
                this.activeActivityChange$.next(null);
            }

            return;
        }

        this.app.activeActivity = activity;
        this.angularCommunicatorService.activeActivity = activity;

        const sharedActivity = {};
        angular.forEach(activity, (value, key: string) => {
            if (key.indexOf('$') === -1) {
                sharedActivity[key] = value;
            }
        });
        this.ref.update({
            activeActivity: sharedActivity,
        });

        if (activityChanged) {
            this.activeActivityChange$.next(sharedActivity);
        }

        if (this.app.activitiesActive && this.onAssessment()) {
            const disableToggle = this.app.atLeastOneStudent ? 1 : 0;
            this.setSharedCursorOn(true, disableToggle);
        }
    }

    restorePreviousActivity = () => {
        if (this.app.previousActiveActivity) {
            this.setActiveActivity(this.app.previousActiveActivity);
        }

    }

    /**
     *  setActiveQueueId
     *  @param queueId
     */
    setActiveQueueId = (queueId) => {
        if (this.ready) {
            this.app.activeQueueId = queueId;
            this.ref.update({
                activeQueueId: queueId,
            });
        }
    }

    setSameSiteUrl = (url) => {
        this.app.sameSiteUrl = url;
        this.ref.update({
            sameSiteUrl: url,
        });
    }

    setRemoteHQUrl = (url) => {
        this.app.remoteHQUrl = url;
        this.ref.update({
            remoteHQUrl: url,
        });
    }

    setSiteshareActive = (active) => {
        if (active) {
            // Disallow shared cursor with site share as it has its own shared cursor.
            this.setSharedCursorOn(false, 1);
            this.setWhiteboardActive(false);
        } else if (!this.onAssessment()) {
            this.setSharedCursorOn(false, 0);
        }
        this.app.siteshareActive = active;
        this.ref.update({
            siteshareActive: active,
        });
    }

    setRemoteHQActive = (active) => {
        if (active) {
            // Disallow shared cursor with site share as it has its own shared cursor.
            this.setSharedCursorOn(false, 1);
            this.setWhiteboardActive(false);
        } else if (!this.onAssessment()) {
            this.setSharedCursorOn(false, 0);
        }
        this.app.remoteHQActive = active;
        this.ref.update({
            remoteHQActive: active,
        });
    }

    /**
     * setScreenshareActive
     * @param active
     */
    setScreenshareActive = (active) => {
        if (active !== this.app.screenshareActive) {
            if (active) {
                // Disallow shared cursor with site share as it has its own shared cursor.
                this.setSharedCursorOn(false, 1);
            } else if (!this.onAssessment()) {
                this.setSharedCursorOn(false, 0);
            }
        }
        this.app.screenshareActive = active;
        this.ref.update({
            screenshareActive: active,
        });
    }

    updateCommunicator = () => {
        this.angularCommunicatorService.activeActivity = this.app.activeActivity;
    }

    onValue = (snap) => {
        const snapDict = snap.val();
        if (snapDict == null) {
            // if the app object is null, let's put the defaults into fb
            this.ref.set(this.app);
            return;
        }
        // update the app model from firebase
        if (this.isActivityChanged(snapDict.activeActivity)) {
            this.activeActivityChange$.next(snapDict.activeActivity);
            this.lastActiveActivity = snapDict.activeActivity;
        }
        Object.assign(this.app, snapDict);
        this.updateCommunicator();
        this.ready = true;
        this.dispatchEvent(snap, snap.val(), 'value', 'firebaseAppModelChange', snap.key);
        this.updateStore();
        this.$timeout(() => {}, 0);
    }

    updateStore() {
        this.ngrxStoreService.dispatch({
            type: 'FIREBASE_UPDATE',
            payload: this.app,
        });
    }

    onChanged = (snap) => {
        if (this.ready) {
            this.app[snap.key] = snap.val();
            this.dispatchEvent(snap, snap.val(), 'change', 'firebaseAppModelChange', snap.key);
            this.updateStore();
            this.$timeout(() => {}, 0);
        }
    }

    onChildRemoved = (snap) => {
        if (this.ready) {
            this.app[snap.key] = null;
            this.dispatchEvent(snap, snap.val(), 'removed', 'firebaseAppModelChange', snap.key);
            this.updateStore();
            this.$timeout(() => {}, 0);
        }
    }

    dispatchEvent = (snap, data, srcType, targetType, key) => {
        const event: any = {};
        event.type = srcType;
        event.data = data;
        event.key = key;
        event._snapshot = snap; // convenience
        this.dispatcherService.dispatch(targetType, null, event);
    }

    private isActivityChanged(activity) {
        return (this.lastActiveActivity && !activity)
            || (!this.lastActiveActivity && activity)
            || (this.lastActiveActivity && activity &&
                this.lastActiveActivity.activityId !== activity.activityId);
    }
}

import { commonModelsModule } from '../models.module';
commonModelsModule.service('firebaseAppModel', ['$log', '$timeout', 'firebaseModel', 'dispatcherService',
    'angularCommunicatorService', 'ngrxStoreService', FirebaseAppModel],
);
