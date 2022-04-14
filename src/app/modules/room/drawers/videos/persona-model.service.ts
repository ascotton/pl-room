import { videosModule } from './videos.module';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { selectIsFirebaseConnected } from '@root/src/app/common/firebase/store';

function personaModelService($log, $q, $state, $stateParams, $timeout, $window, $rootScope,
                             firebaseModel, firebaseAppModel,
                             guidService, videoPublisherService, deviceManager, roomnameModel, currentUserModel,
                             notificationService, remoteLogging, plRoomCleanupService,
                             ngrxStoreService: Store<AppState>, videoCaptureService) {
    const AUDIO_NOTIFICATION_URL = '/assets/audio/sign-on.mp3';

    let isFirebaseConnected = false;

    ngrxStoreService.select(selectIsFirebaseConnected).subscribe((isConnected) => {
        isFirebaseConnected = isConnected;
    });

    class Persona {
        rosterModel: any;
        videoPublisher: any;
        name: string;
        userGroups: [string];
        firebaseRefs: any;
        guid: any;
        showPulseSecondCameraButton: any;
        pulseSecondCamera: any;
        muted: any;
        isLocal: boolean;
        hideVideo: any;
        state: string;
        notification: any;
        showingSpacer: any;
        moreshowing: any;
        container: any;
        hasSecondCamera: boolean;
        video: string;
        subscriber: any;
        stream: any;
        flipped: boolean;
        mirrored: boolean;
        pulsingSecondCamera: any;
        vidWrapper: any;
        secondary: any;
        videoDevice: any;
        screenshare: boolean;
        suppressArchive: boolean;
        waitingId = '';
        isIPadUser = false;
        viewingPage = true;
        youtubeInteractionPending = false;

        stateMonitorInterval = null;
        streamConnection = null;
        blurBackground = false;

        illegalStateCount = 0;
        disconnectedCount = 0;
        restarting: boolean;
        queueRestart: boolean;
        capturing: boolean;

        constructor(options, notify, rosterModel, private tokboxService) {
            // initializing the persona model
            // anything passed into creation
            // will override the defaults
            Object.assign(this, {
                name: 'Guest User',
                userGroups: [],
                video: 'unpublished',
                guid: guidService.generateUUID(),
                isLocal: false,
                muted: false,
                moreshowing: false,
                mirrored: false,
                flipped: false,
                flippedOnce: false,
                userflippedback: false,
                bighead: false,
                grid: false,
                videoPublisher: null,
                hideVideo: false,
                secondary: false,
                screenshare: false,
                suppressArchive: false,
                blurBackground: false,

            }, options);

            this.rosterModel = rosterModel;
            this.videoPublisher = new videoPublisherService(this.name + (new Date()).getTime(), tokboxService);

            if (this.state !== 'waiting') {
                // setting up the firebase references for the persona
                // init firebase values in the addToRoom func
                // handle all firebase callbacks in personaUpdatedFromFirebase
                this.firebaseRefs = {
                    user: firebaseModel.getFirebaseRef(`users/${this.guid}`),
                };
                let fbConnected: any = false;

                if (roomnameModel.value && roomnameModel.value.firebase_baseurl) {
                    fbConnected = firebase.database().ref('/.info/connected');
                }
                Object.assign(this.firebaseRefs, {
                    connections: this.firebaseRefs.user.child('/connections'),
                    connected: fbConnected,
                });
                // update any changes from firebase
                // with this callback
                this.firebaseRefs.user.on('child_changed', (snap) => {
                    if (snap.key === 'state') {
                        this.personaStateUpdatedFromFirebase(snap.val());
                    }
                    if (snap.key === 'showPulseSecondCameraButton') {
                        this.showPulseSecondCameraButton = snap.val();
                    }
                    if (snap.key === 'pulseSecondCamera') {
                        this.pulseSecondCamera = snap.val();
                    }
                    if (snap.key === 'secondary') {
                        this.secondary = snap.val();
                    }
                    if (snap.key === 'screenshare') {
                        this.screenshare = snap.val();
                    }
                    if (snap.key === 'suppressArchive') {
                        this.suppressArchive = snap.val();
                    }
                    if (snap.key === 'muted') {
                        this.muted = snap.val();
                        if (this.isLocal) {
                            this.videoPublisher.mute(snap.val());
                        }
                    }
                    if (snap.key === 'isIPadUser') {
                        this.isIPadUser = snap.val();
                    }
                    if (snap.key === 'youtubeInteractionPending') {
                        this.youtubeInteractionPending = snap.val();
                    }
                    if (snap.key === 'hideVideo') {
                        this.hideVideo = snap.val();
                    }
                    if (snap.key === 'viewingPage') {
                        this.viewingPage = snap.val();
                    }
                    this.rosterModel.personaUpdated(this);
                    $timeout(() => { }, 0);
                });
                this.firebaseRefs.user.on('child_added', (snap) => {
                    if (snap.key === 'captureFileKey') {
                        if (currentUserModel.user.isClinicianOrExternalProvider()) {
                            this.receivedCapture(snap.val());
                        }
                    }
                    // if captureRequested is sent and this is the local instance of this persona
                    // do a video capture.
                    if (snap.key === 'captureRequested') {
                        const captureRequested = snap.val();
                        if (this.isLocal && captureRequested !== '') {
                            this.captureVideo(captureRequested);
                        } else {
                            console.log('[capture] ignoring capture request');
                        }
                    }
                });
            }

            if (notify && !this.isLocal && this.state === 'waiting' &&
                currentUserModel.user.isClinicianOrExternalProvider()) {
                let elephant;
                if (window.navigator.userAgent.indexOf('Firefox')) {
                    elephant = 'elephant_firefox.png';
                } else {
                    elephant = 'elephant.png';
                }
                this.notification = notificationService.notify(
                    'Knock knock', `${this.name} is waiting to enter.`,
                    `/assets/static_images/${elephant}`,
                    AUDIO_NOTIFICATION_URL);
            }

            // Pass variables to ng2.
            plRoomCleanupService.setVars(this.firebaseRefs, this.notification);

            $window.addEventListener('beforeunload', () => {
                this.closeNotification();
            });
            $window.addEventListener('pagehide', () => {
                this.closeNotification();
            });

            if (this.isLocal) {
                const updateViewing = () => {
                    const viewingPage = document.visibilityState === 'visible';
                    this.firebaseRefs.user.update({
                        viewingPage,
                    });
                    $timeout(() => { }, 0);
                };
                updateViewing();
                document.addEventListener('visibilitychange', updateViewing);

                if (currentUserModel.user.isInGroup('student')) {
                    // wait 10 seconds to begin monitoring to avoid inappropriate bad firebase connection warning
                    // being displayed when the page loads slowly. this should correspond to the wait time in
                    // FirebasModel's login callback
                    setTimeout(() => {
                        this.monitorUserFirebaseState();
                    }, 10 * 1000)
                }
            }
        }

        private monitorUserFirebaseState() {
            let state;
            if (this.stateMonitorInterval) {
                clearInterval(this.stateMonitorInterval);
                this.illegalStateCount = 0;
                this.disconnectedCount = 0;
            }
            this.stateMonitorInterval = setInterval(() => {
                try {
                    if (isFirebaseConnected) {
                        this.firebaseRefs.user.once(
                            'value',
                            (snap) => {
                                const val = snap.val();
                                state = (val && val.state) ? val.state : 'nostate';
                                if (!val || !val.state || !this.hasAllowedLocalState(val.state)) {
                                    this.illegalStateCount++;
                                    console.log('persona bad state: ', this.illegalStateCount, state);
                                    if (this.illegalStateCount > 1) {
                                        clearInterval(this.stateMonitorInterval);
                                        this.logMeOut(state);
                                        this.illegalStateCount = 0;
                                        this.disconnectedCount = 0;
                                    }
                                } else {
                                    this.illegalStateCount = 0;
                                    this.disconnectedCount = 0;
                                }
                            },
                            (error) => {
                                this.disconnectedCount++;
                                state = error;
                                console.log('user state check error, ', this.disconnectedCount, error);
                            }
                        );
                    } else {
                        this.disconnectedCount++;
                        state = 'Firebase connection error';
                        console.log('user state firebase not connected, ', this.disconnectedCount);
                    }
                } catch (err) {
                    this.disconnectedCount++;
                    state = 'Firebase connection error';
                    console.log('user state check connection error, ', this.disconnectedCount, err);
                }
                if (this.disconnectedCount > 10) {
                    console.log('state disconnected too long, logout');
                    clearInterval(this.stateMonitorInterval);
                    this.logMeOut(state);
                    this.illegalStateCount = 0;
                    this.disconnectedCount = 0;
                }
            }, 1000);
        }

        private logMeOut(state) {
            console.log('Illegal state, logging out: ', state);
            // currentUserModel.logout();
            window.location.reload();
        }

        private hasAllowedLocalState(state) {
            return ['waiting', 'admitted', 'streaming', 'observing'].indexOf(state) >= 0;
        }

        // async waitForCurrentFirebaseState() {
        //     console.log('waitForCurrentFirebaseState...');
        //     return new Promise(resolve => {
        //         let attempts = 20;

        //         const retry = () => {
        //             console.log('state retry ', (10-attempts));
        //             if (attempts && firebaseModel.connected) {
        //                 console.log('state resolving... ', (10-attempts));
        //                 return this.getCurrentFirebaseState(resolve);
        //             } else if (attempts) {
        //                 attempts--;
        //                 setTimeout(() => {
        //                     retry();
        //                 }, 300)
        //             } else {
        //                 console.log('state giving up... ');
        //                 resolve({notConnected: true});
        //             }
        //         }
        //         retry();
        //     });
        // }

        // private getCurrentFirebaseState(resolve) {
        //     console.log('state getCurrentFirebaseState');
        //     this.firebaseRefs.user.once(
        //         'value',
        //         (snap) => {
        //             const val = snap.val();
        //             resolve({success: val.state});
        //         },
        //         (error) => {
        //             resolve({error});
        //         }
        //     );
        // }

        // sometimes we need to know what the demoted height probably is when creating a layout before the user has
        // actually been animated to their demoted size (and this we can't just ask the container for its height.) Here
        // we check for all the variable features that may contribute to height. This is risky since this is not linked
        // directly to what is in CSS
        // TODO - link these heights to CSS
        getTheoreticalDemotedHeight() {
            let height = 144;
            if (this.showingSpacer) {
                height += 7;
            }
            if (this.moreshowing) {
                height += 55;
            }
            if (this.canShowAnotherLocalVideo() || this.showPulseSecondCameraButtonFn() ||
                this.showStopPulseSecondCameraButtonFn()) {
                height += 34;
            }
            return height;
        }

        getActualHeight() {
            return this.container.height();
        }

        // addToRoom finishes initialization
        // but sometimes must be called later than obj init
        addToRoom() {
            if (currentUserModel.user.isInGroup('Observer')) {
                this.state = 'observing';
            }
            const user = {
                name: this.name,
                userGroups: this.userGroups,
                state: this.state,
                muted: false,
                pulseSecondCamera: false,
                showPulseSecondCameraButton: false,
                hideVideo: false,
                secondary: this.secondary,
                screenshare: this.screenshare,
                suppressArchive: this.suppressArchive,
                waitingId: this.waitingId,
                lastOnline: firebase.database.ServerValue.TIMESTAMP,
                isIPadUser: this.isIPadUser,
                youtubeInteractionPending: this.youtubeInteractionPending,
            };
            this.firebaseRefs.user.update(user);
            this.firebaseRefs.connected.on('value', (snap) => {
                if (snap.val() === true) {
                    this.firebaseRefs.connections
                        .push(true)
                        .onDisconnect()
                        ;
                    this.firebaseRefs.user
                        .onDisconnect()
                        .update({
                            lastOnline: firebase.database.ServerValue.TIMESTAMP,
                        });
                }
                $timeout(() => { }, 0);
            });
            return this;
        }

        // state methods
        closeNotification() {
            if (this.notification) {
                this.notification.close();
            }
        }

        admit() {
            this.rosterModel.admitStudent(this);
            this.closeNotification();
        }

        deny() {
            this.rosterModel.denyStudent(this);
            this.closeNotification();
        }

        dismiss() {
            if (this.stateMonitorInterval) {
                clearInterval(this.stateMonitorInterval);
            }
            this.videoPublisher.forceDisconnect(
                this.streamConnection,
                (error) => {
                    if (error) {
                        console.log('force disconnect error: ', error);
                    }
                    this.changeState('dismissed');
                    this.closeNotification();
                }
            );
        }

        changeState(state) {
            this.state = state;
            this.firebaseRefs.user.update({
                state,
            });
            $timeout(() => { }, 0);
        }
        personaStateUpdatedFromFirebase(state) {
            if (this.state === state) {
                return;
            }
            this.state = state;
            switch (state) {
                case 'admitted':
                    if (this.isLocal) {
                        $state.go('room', {
                            clinician_username: $stateParams.clinician_username,
                        });
                    }
                    break;
                case 'dismissed':
                    if (this.isLocal) {
                        currentUserModel.logout();
                    } else {
                        // from therapist room side, if a student asks to join and leaves before
                        // being admitted, the request notifications should be closed
                        this.closeNotification();
                    }
                    break;
            }
        }

        updateSecondCameraState() {
            this.hasSecondCamera = deviceManager.cameraCount > 1;
            this.firebaseRefs.user.update({
                showPulseSecondCameraButton: !this.isIPadUser && this.hasSecondCamera &&
                    !this.rosterModel.localPersona2,
            });
        }

        // video methods
        startVideo(videoDevice) {
            const deferred = $q.defer();
            if (this.video === 'publishing' || this.video === 'published') {
                deferred.resolve();
            }
            this.video = 'publishing';
            let startFunction: any;
            if (!this.screenshare) {
                startFunction =
                    this.videoPublisher.publish(this.vidWrapper, this.guid, this.blurBackground, this.secondary, false,
                        this.restartVideo.bind(this), videoDevice);
            } else if (this.isLocal) {
                startFunction =
                    this.videoPublisher.screenshare(this.vidWrapper, this.guid);
            } else {
                deferred.resolve();
            }
            if (startFunction) {
                startFunction.then(
                    (publishedVideoDevice: any) => {
                        this.videoDevice = publishedVideoDevice;
                        this.video = 'published';
                        this.changeState('streaming');
                        // we're going to publish an audio feed with each camera, but automatically mute the feed of a
                        // secondary camera
                        if (this.secondary) {
                            this.mute();
                        }
                        this.updateSecondCameraState();
                        // Re-mute if ended muted.
                        this.videoPublisher.mute(this.muted);
                        if (this.muted) {
                            this.mute();
                        }
                        $rootScope.$broadcast('personaPublisherUpdate', { guid: this.guid });
                        deferred.resolve();
                    },
                    (reason) => {
                        $log.log('[PersonaModel] publish failed: ', reason);
                        this.video = 'unpublished';
                        this.changeState('admitted');
                        this.videoDevice = null;
                        deferred.reject(reason);
                    });
            }
            return deferred.promise;
        }

        restartVideo(redeferred) {
            if (this.restarting) {
                this.queueRestart = true;
                return;
            }
            this.queueRestart = false;
            this.restarting = true;

            const deferred = redeferred ? redeferred : $q.defer();

            if (this.video === 'publishing') {
                deferred.resolve();
            }
            this.video = 'publishing';
            this.videoPublisher
                .unpublish(true)
                .then(() => {
                    this.changeState('admitted');
                    this.videoPublisher.publish(this.vidWrapper, this.guid, this.blurBackground,
                        this.secondary, true, this.restartVideo.bind(this)).then(
                            () => {
                                this.video = 'published';
                                this.changeState('streaming');
                                this.videoPublisher.mute(this.muted);
                                $rootScope.$broadcast('personaPublisherUpdate', { guid: this.guid });
                                this.restarting = false;
                                if (this.queueRestart) {
                                    this.restartVideo(deferred);
                                } else {
                                    deferred.resolve();
                                }
                            },
                            (error) => {
                                console.log('restart publish error: ', error);
                                // this.video = 'unpublished';
                                // this.changeState('admitted');
                                // this.stopVideo();
                                deferred.reject();
                            });
                });
            return deferred.promise;
        }

        nextVideo() {
            const deferred = $q.defer();
            this.video = 'publishing';
            this.videoPublisher
                .unpublish(true)
                .then(() => {
                    this.changeState('admitted');
                    $timeout(
                        () => {
                            this.videoPublisher
                                .publish(this.vidWrapper, this.guid, this.blurBackground, this.secondary, false,
                                    this.restartVideo.bind(this), null, this.videoDevice)
                                .then((publishedVideoDevice: any) => {
                                    this.videoDevice = publishedVideoDevice;
                                    this.video = 'published';
                                    this.changeState('streaming');
                                    this.videoPublisher.mute(this.muted);
                                    if (this.muted) {
                                        this.mute();
                                    }
                                    $rootScope.$broadcast('personaPublisherUpdate', { guid: this.guid });
                                    deferred.resolve();
                                });
                        },
                        100);
                });
            return deferred.promise;
        }

        stopVideo() {
            const deferred = $q.defer();
            if (this.video !== 'published') {
                deferred.resolve();
            }
            this.videoPublisher
                .unpublish(!this.screenshare)
                .then(() => {
                    this.video = 'unpublished';
                    this.changeState('admitted');
                    // this.videoDevice = null;
                    deferred.resolve();
                }, (e) => {
                    console.log('unpublish error in stopVideo: ', e);
                    deferred.reject();
                });
            if (!this.secondary && !this.screenshare && this.rosterModel.localPersona2) {
                this.rosterModel.makeSecondaryPrimary();
            }
            return deferred.promise;
        }

        toggleHideVideo() {
            if (this.hideVideo) {
                this.hideVideo = false;
                this.firebaseRefs.user.update({
                    hideVideo: false,
                });
            } else {
                this.hideVideo = true;
                this.firebaseRefs.user.update({
                    hideVideo: true,
                });
            }
        }

        setYoutubeInteractionPending(isPending) {
            this.firebaseRefs.user.update({
                youtubeInteractionPending: isPending,
            });
        }

        isYoutubeInteractionPending() {
            return this.youtubeInteractionPending;
        }

        subscribeToVideo(stream) {
            const deferred = $q.defer();
            this.stream = stream || this.stream;
            if (!stream || !this.vidWrapper) {
                deferred.resolve({ subscriber: null });
            } else if (this.video === 'streaming') {
                this.unsubscribeToVideo().then(() => {
                    this.subscribeToVideo(stream).then((result) => {
                        deferred.resolve(result);
                    });
                });
            } else if (this.video === 'unpublished') {
                this.video = 'streaming';
                this.streamConnection = stream.connection;

                // TODO: commenting out for now, to be on the safe side.
                //    In theory... a PersonaModel that represents a remote stream to subscribe to
                //    should not change that user's state when subscribing or unsubscribing.
                // this.changeState('streaming');
                this.subscriber = this.tokboxService.subscribe(stream, this.vidWrapper[0], {
                    name: this.name,
                    userGroups: this.userGroups,
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    insertMode: 'append',
                    showControls: false,
                }, (error) => {
                    if (error) {
                        console.log('subscribeToVideo error: ', error);
                        remoteLogging.logTokboxErrorToSentry('Tokbox error on subscribeToVideo in PersonaModel',
                            this.tokboxService.getSession(), error);
                        this.unsubscribeToVideo().then(() => {
                            deferred.resolve({ subscriber: null });
                        });
                    } else {
                        deferred.resolve({ subscriber: this.subscriber });
                    }
                });
            } else {
                deferred.resolve({ subscriber: null });
            }
            return deferred.promise;
        }
        // NOTE: unsubscribe needs to remove the video from the page
        // to allow a later call to subscribe with insertMode: 'append'
        unsubscribeToVideo() {
            const deferred = $q.defer();
            if (this.subscriber) {
                this.tokboxService.unsubscribe(this.subscriber);
                this.video = 'unpublished';
                deferred.resolve();
            } else {
                this.video = 'unpublished';
                deferred.resolve();
            }
            // TODO: commenting out for now, to be on the safe side.
            //    In theory... a PersonaModel that represents a remote stream to subscribe to
            //    should not change that user's state when subscribing or unsubscribing.
            // this.changeState('admitted');
            return deferred.promise;
        }
        destroy() {
            const deferred = $q.defer();
            this.unsubscribeToVideo().then(() => {
                $('#' + this.guid).remove();
                deferred.resolve();
            });
            return deferred.promise;
        }

        promote() {
            firebaseAppModel.promotePersona(this.guid);
        }
        demote() {
            firebaseAppModel.demotePersona(this.guid);
        }
        rotateVideo() {
            this.flipped = !this.flipped;
            // if(!this.flipped && this.flippedOnce){
            //     this.userflippedback = true;
            // } else {
            //    this.userflippedback = false;
            // }
            // this.flippedOnce = true;
        }
        mirrorVideo() {
            this.mirrored = !this.mirrored;
        }

        dataURLtoBlob(dataurl) {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }

        unmute() {
            this.muted = false;
            this.firebaseRefs.user.update({
                muted: false,
            });
        }

        mute() {
            this.muted = true;
            this.firebaseRefs.user.update({
                muted: true,
            });
        }

        toggleMute() {
            if (this.muted) {
                this.unmute();
            } else {
                this.mute();
            }
        }

        // show the "Start Another Video" button if the user is local, we've detected a second camera, but don't
        // have a second local user yet
        canShowAnotherLocalVideo() {
            return !this.isIPadUser && this.isLocal && this.hasSecondCamera && !this.rosterModel.localPersona2;
        }

        showPulseSecondCameraButtonFn() {
            return !this.pulsingSecondCamera && this.showPulseSecondCameraButton &&
                currentUserModel.user.isClinicianOrExternalProvider() && !this.isLocal;
        }

        showStopPulseSecondCameraButtonFn() {
            return this.pulsingSecondCamera && this.showPulseSecondCameraButton &&
                currentUserModel.user.isClinicianOrExternalProvider() && !this.isLocal;
        }

        stopPulseSecondCamera() {
            this.pulsingSecondCamera = false;
            this.firebaseRefs.user.update({
                pulseSecondCamera: false,
            });
        }

        startPulseSecondCamera() {
            this.pulsingSecondCamera = true;
            this.firebaseRefs.user.update({
                pulseSecondCamera: true,
            });
        }

        localCaptureMode = () => videoCaptureService.localCaptureMode;

        /**
         * request a video capture. if this is local, call captureVideo directly,
         * otherwise, set the captureRequested state in firebase so it will be captured
         * wherever it is local.
         */
        requestCapture() {
            console.log('[capture] ~~~~~~~~~~~~~ REQUESTER CAPTURE CYCLE BEGIN ~~~~~~~~~~~~~');
            console.log('[capture] requestCapture');
            this.capturing = true;
            videoCaptureService.startNextCapture().subscribe(
                (amazonUrl) => {
                    if (videoCaptureService.localCaptureMode || this.isLocal) {
                        this.captureVideo({amazonUrl});
                    } else {
                        this.firebaseRefs.user.child('captureRequested').set(
                            {
                                amazonUrl,
                                flipped: this.flipped,
                                mirrored: this.mirrored,
                            },
                        );
                    }
                }
            )
        }

        // capture a frame of video and write the result to firebase
        captureVideo(request) {
            console.log('[capture] ~~~~~~~~~~~~~ TARGET CAPTURE CYCLE BEGIN ~~~~~~~~~~~~~');
            console.log('[capture] captureVideo: ', request);
            const videoElement = this.vidWrapper.find('video')[0];
            videoCaptureService.capture(videoElement, request.amazonUrl, request.flipped, request.mirrored).subscribe(
                (result) => {
                    console.log('[capture] video captured: ', result);
                    console.log('[capture] ~~~~~~~~~~~~~ TARGET CAPTURE CYCLE END ~~~~~~~~~~~~~');
                    if (videoCaptureService.localCaptureMode) {
                        this.receivedCapture(result.key);
                    } else {
                        this.firebaseRefs.user.child('captureRequested').remove();
                        this.firebaseRefs.user.update({
                            captureFileKey: result.key,
                        });
                    }
                },
                (error) => {
                    console.log('capture error: ', error);
                    if (!videoCaptureService.localCaptureMode) {
                        this.firebaseRefs.user.child('captureRequested').remove();
                        this.firebaseRefs.user.update({
                            captureFileKey: 'ERROR',
                        });
                    }
                }
            );
        }

        cancelCapture() {
            this.capturing = false;
        }

        interruptJumbotronCaptureSession() {
            videoCaptureService.clientInterrupted(this.guid);
        }

        receivedCapture(captureFileKey) {
            console.log('[capture] receivedCapture: ', captureFileKey);
            console.log('[capture] ~~~~~~~~~~~~~ REQUESTER CAPTURE CYCLE END ~~~~~~~~~~~~~');
            this.capturing = false;
            if (captureFileKey !== 'ERROR' && captureFileKey !== '') {
                setTimeout(() => {
                    videoCaptureService.nextCaptureReceived(captureFileKey, this.guid);
                });
                this.firebaseRefs.user.child('captureFileKey').remove();
            }
        }

        remove() {
            videoCaptureService.clientExiting(this.guid);
            this.firebaseRefs.user.off('child_changed');
            this.firebaseRefs.user.off('child_added');
        }

    }
    return Persona;
}
personaModelService.$inject = [
    '$log',
    '$q',
    '$state',
    '$stateParams',
    '$timeout',
    '$window',
    '$rootScope',
    'firebaseModel',
    'firebaseAppModel',
    'guidService',
    'videoPublisherService',
    'deviceManager',
    'roomnameModel',
    'currentUserModel',
    'notificationService',
    'remoteLogging',
    'plRoomCleanupService',
    'ngrxStoreService',
    'videoCaptureService',
];
videosModule.service('personaModelService', personaModelService);
