
class PersonaController {
    static $inject = ['$element', '$scope', 'firebaseAppModel', 'rosterModelService',
        'deviceManager', 'appModel', 'tokboxService', '$rootScope', 'iPadSupportService'];
    user: any;
    qosIndicatorEnabled = false;
    isHovering = false;
    showMoreVideoOptions = false;
    localuser: any;
    qualityFail: boolean;
    qualityAlertDismissed = false;
    lastQualityScore = -1;
    qualityType: any;
    isStudent = false;
    audioLevelPercent = 0;
    audioLevelAdded = false;
    audioLevelAddedPublisher = false;
    audioLevelLastUpdate = 0;
    audioLevelsOn = false;
    audioLevelsReady = false;
    isIPad = false;
    hoveringTimeout: any;

    screenshotting: any;
    captureVideoOn: any;
    otherScreenshotting: boolean;

    constructor(private $element, private $scope, private firebaseAppModel, private rosterModel,
                private deviceManager, private appModel, private tokboxService, private $rootScope,
                private iPadService) {
    }

    $postLink = () => {
        this.isIPad = this.iPadService.isIPad();
        this.isStudent = (this.user.rosterModel && this.user.rosterModel.currentUserModel &&
            this.user.rosterModel.currentUserModel.user && this.user.rosterModel.currentUserModel.user.groups &&
            this.user.rosterModel.currentUserModel.user.groups.includes('student')) ? true : false;
        this.user.vidWrapper = this.$element.find('.vid-wrapper');
        this.user.container = $(this.$element).find('.persona-container');
        this.user.subscribeToVideo(this.user.stream).then((res) => {
            if (res.subscriber && res.subscriber.streamId) {
                this.user.subscriberTokbox = res.subscriber;
                this.checkAudioLevelsSubscriber();
            }
        });

        const DEV_AUTO_ADMIT = localStorage.getItem('PL_DEV_AUTO_ADMIT') && location.hostname === 'localhost';
        this.$scope.$watch(() => this.user, () => {
            if (this.user) {
                this.user.vidWrapper = this.$element.find('.vid-wrapper');
                if (DEV_AUTO_ADMIT) {
                    if (this.user.state === 'waiting') {
                        console.log('💧(DEV-ONLY) auto-admitting user...');
                        this.user.admit();
                    }
                }
            }
        });

        this.$scope.$watch(() => this.firebaseAppModel.app.fullscreen, (val) => {
            if (val !== 'wide') {
                this.exitedWidescreen();
            }
        });

        this.$rootScope.$on('personaSubscriberUpdate', (evt, data) => {
            if (data.guid === this.user.guid) {
                if (data.subscriber && data.subscriber.streamId) {
                    this.user.subscriberTokbox = data.subscriber;
                }
                this.checkAudioLevelsSubscriber();
            }
        });

        this.$scope.$on('personaPublisherUpdate', (evt, data) => {
            if (data.guid === this.user.guid) {
                this.checkAudioLevelsPublisher();
            }
        });

        if (this.user.isLocal && !this.user.secondary) {
            this.$scope.$watch(
                () => this.appModel.app.backgroundBlurOn,
                (val) => {
                    if (val !== this.user.blurBackground) {
                        this.user.blurBackground = val;
                        if ((this.user.state === 'streaming' || this.user.video === 'publishing') &&
                                !this.user.secondary) {
                            this.user.restartVideo();
                        }
                    }
                },
            );
        }

        this.$rootScope.$on('personaAudioLevelsUpdate', (evt, data) => {
            if (data.guid === this.user.guid) {
                if (data.audioLevelsOn) {
                    this.setAudioLevelsOn();
                } else {
                    this.setAudioLevelsOff();
                }
            }
        });
    }

    // reverse the mirroring if backgroundBlur is on, as the filtered-canvas for backgroundBlur
    // renders the same as what is broadcase, and so need to flip the mirroring logic
    shouldMirror() {
        if (this.user.blurBackground) {
            return !this.user.mirrored;
        }
        return this.user.mirrored;
    }

    mouseover(evt) {
        if (!this.isIPad) {
            this.isHovering = true;
        }
    }

    mouseleave(evt) {
        if (!this.isIPad) {
            this.isHovering = false;
        }
    }

    timeoutHovering() {
        if (this.isIPad && this.isHovering) {
            if (this.hoveringTimeout) {
                clearTimeout(this.hoveringTimeout);
            }
            this.hoveringTimeout = setTimeout(() => {
                this.isHovering = false;
                this.$scope.$apply();
            }, 5000);
        }
    }

    personaClicked() {
        if (this.isIPad) {
            this.isHovering = !this.isHovering;
            this.timeoutHovering();
        }
    }

    addAudioLevels(subscriberOrPublisher, type) {
        subscriberOrPublisher.on('audioLevelUpdated', (event) => {
            const now = Date.now();
            if (this.audioLevelLastUpdate === 0 || (now - this.audioLevelLastUpdate) > 250) {
                this.audioLevelLastUpdate = now;
                let movingAvg = null;
                if (movingAvg === null || movingAvg <= event.audioLevel) {
                    movingAvg = event.audioLevel;
                } else {
                    movingAvg = 0.7 * movingAvg + 0.3 * event.audioLevel;
                }
                // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
                let logLevel = (Math.log(movingAvg) / Math.LN10) / 1.5 + 1;
                logLevel = Math.min(Math.max(logLevel, 0), 1);
                // To avoid too much distraction, just use 3 levels: 0, 10, or 100.
                const logLevelPercent = logLevel > 0.01 ? Math.floor(Math.max(50, logLevel * 100)) : 0;
                // if (logLevelPercent > 0.5) {
                //     logLevelPercent = 100;
                // }
                this.audioLevelPercent = logLevelPercent;
                this.$scope.$apply();
            }
        });
        subscriberOrPublisher.on('destroyed mediaStopped streamDestroyed', (event) => {
            if (type === 'subscriber') {
                this.removeAudioLevelsSubscriber();
            } else if (type === 'publisher') {
                this.removeAudioLevelsPublisher();
            }
        });
    }

    removeAudioLevels(subscriberOrPublisher) {
        if (subscriberOrPublisher) {
            subscriberOrPublisher.off('audioLevelUpdated');
        }
    }

    checkAudioLevelsSubscriber() {
        // this.audioLevelsOn = false;
        if (this.user.subscriberTokbox) {
            this.audioLevelsReady = true;
            if (this.audioLevelsOn) {
                this.setAudioLevelsOn();
            } else {
                this.setAudioLevelsOff();
            }
        }
    }

    checkAudioLevelsPublisher() {
        // this.audioLevelsOn = false;
        if (this.user.videoPublisher.publisher) {
            this.audioLevelsReady = true;
            if (this.audioLevelsOn) {
                this.setAudioLevelsOn();
            } else {
                this.setAudioLevelsOff();
            }
        }
    }

    addAudioLevelsSubscriber() {
        if (!this.audioLevelAdded && this.user.subscriberTokbox) {
            this.audioLevelAdded = true;
            this.addAudioLevels(this.user.subscriberTokbox, 'subscriber');
        }
    }

    addAudioLevelsPublisher() {
        if (!this.audioLevelAddedPublisher && this.user.videoPublisher.publisher) {
            this.audioLevelAddedPublisher = true;
            this.addAudioLevels(this.user.videoPublisher.publisher, 'publisher');
        }
    }

    removeAudioLevelsSubscriber() {
        this.removeAudioLevels(this.user.subscriberTokbox);
        this.audioLevelAdded = false;
        this.audioLevelPercent = 0;
    }

    removeAudioLevelsPublisher() {
        this.removeAudioLevels(this.user.videoPublisher.publisher);
        this.audioLevelAddedPublisher = false;
        this.audioLevelPercent = 0;
    }

    audioLevelsGetType() {
        let type = null;
        if (this.user.subscriberTokbox) {
            type = 'subscriber';
        } else if (this.user.videoPublisher.publisher) {
            type = 'publisher';
        }
        return type;
    }

    toggleAudioLevels() {
        this.audioLevelsOn = !this.audioLevelsOn;
        if (this.audioLevelsOn) {
            this.setAudioLevelsOn();
        } else {
            this.setAudioLevelsOff();
        }
    }

    setAudioLevelsOn() {
        this.audioLevelsOn = true;
        const type = this.audioLevelsGetType();
        if (type === 'subscriber') {
            this.addAudioLevelsSubscriber();
        } else if (type === 'publisher') {
            this.addAudioLevelsPublisher();
        }
    }

    setAudioLevelsOff() {
        this.audioLevelsOn = false;
        const type = this.audioLevelsGetType();
        if (type === 'subscriber') {
            this.removeAudioLevelsSubscriber();
        } else if (type === 'publisher') {
            this.removeAudioLevelsPublisher();
        }
    }

    getPersonaClasses = () => {
        if (!this.user) {
            return 'no-user';
        }
        const classes = {
            persona: true,
            'request-admission': this.user.state === 'waiting',
            'observer-no-video': this.user.state === 'admitted',
            'streaming-video': this.user.state === 'streaming',
            local: false,
            moreshowing: false,
        };
        if (this.localuser) {
            classes.local = true;
        }
        if (this.showMoreVideoOptions) {
            classes.moreshowing = true;
        }
        return classes;
    }

    name = () => {
        if (!this.user || !this.user.name) {
            return '';
        }
        const length = 32;
        let name = this.user.name;
        if (name.length > length) {
            name = name.substr(0, length);
            name += '...';
        }
        return name;
    }

    isIPadUser = () => {
        return this.user.isIPadUser;
    }

    isYoutubeInteractionPending = () => {
        return this.user.youtubeInteractionPending;
    }

    promote = () => {
        this.isHovering = false;
        this.user.promote();
    }

    demote = () => {
        this.isHovering = false;
        this.user.demote();
    }

    hideMore = () => {
        this.showMoreVideoOptions = false;
        this.user.moreshowing = false;
        this.rosterModel.personaUpdated(this);
    }

    toggleMore = () => {
        this.showMoreVideoOptions = !this.showMoreVideoOptions;
        this.user.moreshowing = !this.user.moreshowing;
        this.rosterModel.personaUpdated(this);
    }

    showNextCameraButton() {
        return this.localuser && this.deviceManager.unclaimedCount > 0;
    }

    isWidescreen = () =>
        this.firebaseAppModel.app.fullscreen !== 'normal'

    startSecondaryVideo = () => {
        this.rosterModel.startSecondaryVideo();
    }

    showQualityAlert = () => {
        const score = this.rosterModel.showQualityAlert(this.user.subscriber);
        if (score != null && !this.qualityAlertDismissed) {
            if (score === 0) {
                this.qualityFail = true;
                return true;
            // tslint:disable-next-line:no-else-after-return
            } else if (score != null && score <= 1) {
                this.qualityFail = false;
                return true;
            }
        }
        this.qualityFail = false;
        return false;
    }

    closeAlert = () => {
        this.qualityAlertDismissed = true;
        this.qualityType = null;
    }

    // append the spacer div when not in full screen mode and when this is the 'last' local user (they are
    // either rosterMode.local if there's no local2, or rosterModel.localPersona2)
    showPersonaSpacer = () => {
        if (this.user) {
            const val =
                (!this.rosterModel.localPersona2 && this.user.isLocal || this.user.secondary) && !this.user.bighead;
            this.user.showingSpacer = val;
            return val;
        }
        return null;
    }

    showHoverTools = () => {
        return this.user.state === 'streaming' && (this.isHovering || this.screenshotting) &&
            !this.appModel.showAssessmentInstructionsJumbotronOverlay;
    }

    showScreenshotButton = () =>
        this.user.bighead && !this.otherScreenshotting &&
        !this.captureVideoOn && !this.user.isLocal

    showCaptureButton = () =>
        this.user.bighead && !this.otherScreenshotting &&
        this.captureVideoOn && !this.user.capturing

    beginScreenshotting() {
        this.screenshotting = true;
    }
    captureNext() {
        this.user.requestCapture();
    }
    setJumbotronTarget = (id) => {
        setTimeout(() => {
            this.captureVideoOn = id === this.user.guid;
            this.screenshotting = id === this.user.guid;
            this.otherScreenshotting = id && id !== '' && id !== this.user.guid;
        });
    }
    cancelCapture() {
        this.user.cancelCapture();
    }

    exitedWidescreen() {
        if (this.screenshotting) {
            this.user.interruptJumbotronCaptureSession();
            this.captureVideoOn = false;
            this.screenshotting = false;
        }
    }

    videoCaptureComplete() {
        this.captureVideoOn = false;
        this.screenshotting = false;
    }
}

export default PersonaController;

import { videosModule } from './videos.module';

const personaComponent = videosModule.component('persona', {
    template: require('./persona.component.html'),
    bindings: {
        user: '=',
        localuser: '@',
    },
    controller: PersonaController,
});
