import { videosModule } from './videos.module';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Participant, ParticipantStatus, ParticipantType, SessionActions, SessionState } from '@room/session/store';
import { selectAuth } from '@root/src/app/modules/user/store';

export class RosterModelService {
    static $inject = [
        '$log',
        '$q',
        '$timeout',
        'guidService',
        'firebaseModel',
        'currentUserModel',
        'personaModelService',
        'tokboxService',
        'deviceManager',
        'firebaseAppModel',
        '$rootScope',
        'angularCommunicatorService',
        'tokboxWaitingRoomService',
        'iPadSupportService',
        'ngrxStoreService',
    ];

    personas = [];
    waitingPersonas = [];
    localPersonas = [];
    iPadStudentsPendingYoutubeInteraction = [];
    personaListeners = [];
    unsubscribedStreamsEvents = [];
    allStreams = {};

    localPersonaGuids = [];

    localPersona = null;
    localPersona2 = null;
    appIsOffline: boolean;
    that = this;

    firebaseRoom: any;
    lastLocalPersonaState: any;
    lastLocalPersona2State: any;
    resetting: boolean;
    resetAgain: boolean;
    screenshareStream: any;
    lastAudioLevelsOn;
    departingTimouts =  [];

    handlingUnload = false;
    ngrxStoreService: Store<SessionState>;

    readonly UI_FLAGS_BACKGROUND_BLURRING = 'background-blurring';

    subscription: any;
    canBlur = false;

    constructor(private $log,
                private $q,
                private $timeout,
                private guidService,
                private firebaseModel,
                private currentUserModel,
                private personaModel,
                private tokboxService,
                private deviceManager,
                private firebaseAppModel,
                private $rootScope,
                private angularCommunicatorService,
                private tokboxWaitingRoomService,
                private iPadService,
                ngrxStoreService,
    ) {
        this.ngrxStoreService = ngrxStoreService;

        this.subscription = ngrxStoreService.select(selectAuth)
            .subscribe(({ isAuthenticated, user }) => {
                if (isAuthenticated && user && user.xEnabledUiFlags) {
                    this.canBlur = user.xEnabledUiFlags.find(
                        (_: any) => _ === this.UI_FLAGS_BACKGROUND_BLURRING,
                    );
                } 
            });

        this.firebaseRoom = this.firebaseModel.getFirebaseRef('users');

        this.firebaseModel.getFirebaseRef('app').on('value', (snapshot) => {
            const val = snapshot.val();
            if (this.lastAudioLevelsOn === undefined || this.lastAudioLevelsOn !== val.audioLevelsOn) {
                this.lastAudioLevelsOn = val.audioLevelsOn;
                this.personas.forEach((persona) => {
                    this.$rootScope.$broadcast('personaAudioLevelsUpdate', {
                        guid: persona.guid,
                        audioLevelsOn: val.audioLevelsOn,
                    });
                });
                this.localPersonas.forEach((persona) => {
                    this.$rootScope.$broadcast('personaAudioLevelsUpdate', {
                        guid: persona.guid,
                        audioLevelsOn: val.audioLevelsOn,
                    });
                });
            }
        });

        const handleOffline = () => {
            $log.debug('[RosterModel] offline');
            this.appIsOffline = true;
            this.lastLocalPersonaState = this.localPersona ? this.localPersona.state : null;
            this.lastLocalPersona2State = this.localPersona2 ? this.localPersona2.state : null;
            this.firebaseRoom.off('child_added', snap => this.updatePersonasArrayFromFirebase(snap, 'child_added'));
            this.firebaseRoom.off('child_removed', snap => this.updatePersonasArrayFromFirebase(snap, 'child_removed'));
            this.firebaseRoom.off('child_changed', snap => this.updatePersonasArrayFromFirebase(snap, 'child_changed'));
        };

        const handleOnline = () => {
            if (this.appIsOffline) {
                $log.debug('[RosterModel] online, Recovering from network outage');
                if (this.localPersona && this.lastLocalPersonaState !== 'observing') {
                    this.$timeout(() => {
                        this.resetAll();
                    }, 100);
                } else {
                    $log.debug('[RosterModel] *not* Recovering from network outage');
                }
            }
            this.appIsOffline = false;
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        const dismissLocals = () => {
            if (this.localPersona) {
                this.localPersona.dismiss();
            }
            if (this.localPersona2) {
                this.localPersona2.dismiss();
            }
            // cleanup after ourselves
            this.localPersona = undefined;
            this.localPersona2 = undefined;
            this.localPersonas = [];
            this.personas = [];
            this.firebaseAppModel.setAtLeastOneStudent(false);
            this.angularCommunicatorService.updatePersonas(this.personas, 'remote');
            this.angularCommunicatorService.updatePersonas(this.localPersonas, 'local');
        };

        // Setup logout callbacks
        currentUserModel.onLogout(() => tokboxService.shutdown()
            .then(() => dismissLocals()));

        const handleUnload = () => {
            // this can get called twice by devices that throw both beforeunload and pagehide events
            // (which is most of them), only iPads throw just pagehide
            if (this.handlingUnload) {
                return;
            }
            this.handlingUnload = true;
            dismissLocals();
            // ensure audio levels are off any time therapist leads, so it always loads off
            this.firebaseAppModel.setAudioLevelsOn(false);
        };
        // as a backup, also dismiss on beforeunload. (attempt to reduce ghosts...)
        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('pagehide', handleUnload);
    }

    reset() {
        this.lastLocalPersonaState = this.localPersona ? this.localPersona.state : null;
        this.lastLocalPersona2State = this.localPersona2 ? this.localPersona2.state : null;
        this.$timeout(() => {
            this.resetAll();
        }, 100);
    }

    awaitStudentLogin() {
        this.tokboxWaitingRoomService.awaitStudentLogin(
            (name, id) => this.addAwaitingPersona(name, id),
            id => this.personaLeft(id),
        );
    }

    addAwaitingPersona(name, id) {
        /*i
        const participant: Participant = {
            id,
            displayName: name,
            type: ParticipantType.guest,
            status: ParticipantStatus.waiting,
            isViewingPage: true,
            isIPad: false,
            omitFromSessionRecord: false,
            isYoutubeInteractionPending: false,
            joinMuted: false,
        };
        // this.ngrxStoreService.dispatch(SessionActions.addParticipant({ participant }));
        f (this.departingTimouts[id]) {
            clearTimeout(this.departingTimouts[id]);
        }
        const options = {
            name,
            guid: id,
            state: 'waiting',
            muted: true,
        };
        const waitingPersona = new this.personaModel(options, true, this, this.tokboxWaitingRoomService);
        this.waitingPersonas = this.waitingPersonas.filter(persona => persona.guid !== id);
        this.waitingPersonas.push(waitingPersona);*/
    }

    personaLeft(id) {
        const departed = this.waitingPersonas.find(persona => persona.guid === id);
        if (departed) {
            departed.state = 'departed';
        }
        this.departingTimouts[id] = setTimeout(() => {
            this.waitingPersonas = this.waitingPersonas.filter(persona => persona.guid !== id);
        }, 50);

    }

    admitStudent(persona) {
        persona.state = 'admit-attempted';
        this.tokboxWaitingRoomService.admitStudent(persona.guid, persona.name).then(
            () => {
                persona.state = 'entering';
                setTimeout(() => {
                    persona.state = 'not-entering';
                }, 20000);
            },
            () => {
                persona.state = 'not-entering';
            }
        );
    }

    denyStudent(persona) {
        this.waitingPersonas = this.waitingPersonas.filter(p => p.guid !== persona.guid);
        this.tokboxWaitingRoomService.denyStudent(persona.guid, persona.name);
    }

    private onAddPersona(persona) {
        // Need to use a timeout since this creates the persona component, which is where
        // the listener is. If we fire before the listener is ready, it will be missed.
        setTimeout(() => {
            this.$rootScope.$broadcast('personaAudioLevelsUpdate', {
                guid: persona.guid,
                audioLevelsOn: this.lastAudioLevelsOn,
            });
        }, 5000);
    }

    private unpublishLocals() {
        const deferred = this.$q.defer();
        if (this.localPersona2) {
            this.localPersona2.changeState('interrupted');
            this.localPersona2.stopVideo().then(() => {
                this.localPersona2 = null;
                if (this.localPersona) {
                    this.localPersona.changeState('interrupted');
                    this.localPersona.stopVideo().then(() => {
                        this.localPersona = null;
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
            });
        } else if (this.localPersona) {
            this.localPersona.changeState('interrupted');
            this.localPersona.stopVideo().then(() => {
                this.localPersona = null;
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    private async resetAll() {
        if (this.resetting) {
            this.resetAgain = true;
            return;
        }
        // restore state, including local video and incoming streams, as applicable
        this.personas.forEach(persona => persona.remove());
        this.personas = [];
        this.angularCommunicatorService.updatePersonas(this.personas, 'remote');
        this.personaListeners = [];
        this.unsubscribedStreamsEvents = [];
        this.allStreams = {};
        this.deviceManager.resetAll();
        this.resetting = true;
        this.firebaseAppModel.setAtLeastOneStudent(false);

        const bailCheck = () => {
            if (this.appIsOffline) {
                this.resetting = false;
                return true;
            }
            return false;
        };

        this.tokboxService.shutdown().then(() => {
            if (bailCheck()) return;
            this.tokboxService.initTokbox().then(
                () => {
                    if (bailCheck()) return;
                    const restartSecondary = !!this.localPersona2 && this.lastLocalPersona2State === 'streaming';
                    this.unpublishLocals().then(() => {
                        if (bailCheck()) return;
                        this.localPersonas = [];
                        this.angularCommunicatorService.updatePersonas(this.localPersonas, 'local');
                        this.$timeout(() => {
                            if (bailCheck()) return;
                            if (this.lastLocalPersonaState === 'streaming' ||
                                this.lastLocalPersonaState === 'admitted') {
                                this.initializeLocalPersona({
                                    state: 'admitted',
                                    waitingId: this.currentUserModel.user.waitingId ? this.currentUserModel.user.waitingId : '',
                                });
                                this.$timeout(() => {
                                    if (bailCheck()) return;
                                    if (this.lastLocalPersonaState === 'streaming') {
                                        this.localPersona.startVideo().then(() => {
                                            if (restartSecondary) {
                                                this.startSecondaryVideo();
                                            }
                                        });
                                    } else if (restartSecondary) {
                                        this.startSecondaryVideo();
                                    }
                                });

                            } else if (this.lastLocalPersonaState === 'waiting') {
                                this.initializeLocalPersona({
                                    state: 'waiting',
                                    waitingId: this.currentUserModel.user.waitingId ? this.currentUserModel.user.waitingId : '',
                                });
                            }
                            this.setupFirebaseEvents();
                            this.resetting = false;
                            if (this.resetAgain) {
                                this.resetAgain = false;
                                this.resetAll();
                            }
                        });
                    });
                },
            );
        });
    }

    private getPersonasIndexByGuid(guid) {
        for (let ii = 0; ii < this.personas.length; ii++) {
            if (this.personas[ii].guid === guid) {
                return ii;
            }
        }
        return -1;
    }

    private personaFromRosterByGuid(guid) {
        return _.find(this.personas, persona => persona.guid === guid);
    }

    private hasVisibleState(p) {
        return ['waiting', 'admitted', 'streaming'].indexOf(p.state) >= 0;
    }

    private hasAllowedState(p) {
        return ['waiting', 'admitted', 'streaming', 'observing'].indexOf(p.state) >= 0;
    }

    private updatePersonasArrayFromFirebase(snap, updateType) {
        const personaGuid = snap.key;
        if (personaGuid === 'SCREENSHARE') {
            return;
        }

        const firebaseModelVal = snap.val();

        const lastOnline = moment(firebaseModelVal.lastOnline);
        const yesterday = moment().subtract(1, 'days');
        const lastWeek = moment().subtract(7, 'days');
        if (lastOnline.isBefore(lastWeek) ||
            (firebaseModelVal.state === 'waiting' ||
            firebaseModelVal.state === 'dismissed' && lastOnline.isBefore(yesterday))) {
            this.$log.debug('removing old user: ', firebaseModelVal);
            this.firebaseRoom.child(personaGuid).remove();
            return;
        }

        let personaFromRoster = this.personaFromRosterByGuid.call(this, personaGuid);
        const allowedState = this.hasAllowedState(firebaseModelVal);
        const hasConnections = firebaseModelVal.hasOwnProperty('connections');
        const visibleState = this.hasVisibleState(firebaseModelVal);

        // if the persona is found to be in the roster, but is now not in a legal state, remove them from the roster
        if (personaFromRoster && (!allowedState || !hasConnections) && !visibleState) {
            console.log('[rostermodel] persona in illegal state, removing: ', personaFromRoster);
            personaFromRoster.remove();
            this.personas.splice(this.personas.indexOf(personaFromRoster), 1);
        }

        // if the persona is not in the roster, but has a legal state, create a persona from them, add that persona
        // to the roster and subscribe to their feed.
        if (allowedState && !personaFromRoster && hasConnections && visibleState) {
            if (this.localPersonaGuids.includes(personaGuid)) {
                return false;
            }

            // create the persona, add it to the roster
            firebaseModelVal.guid = personaGuid;
            let matchedStreamIndex;
            const newPersona = new this.personaModel(firebaseModelVal, true, this, this.tokboxService);
            this.personas.unshift(newPersona);
            this.onAddPersona(newPersona);

            if (newPersona.waitingId) {
                const waitingPersona = this.waitingPersonas.find(persona => persona.guid === newPersona.waitingId);
                if (waitingPersona) {
                    waitingPersona.unsubscribeToVideo();
                    this.waitingPersonas = this.waitingPersonas.filter(p => p.guid !== newPersona.waitingId);
                }
            }

            // check if there is an unsubscribed stream for the user, and if so, subscribe to it
            this.unsubscribedStreamsEvents.every((event, index) => {
                if (personaGuid === event.stream.name) {
                    matchedStreamIndex = index;
                    newPersona.stream = event.stream;
                    newPersona.subscribeToVideo(event.stream).then((res) => {
                        const index = this.getPersonasIndexByGuid(newPersona.guid);
                        if (index > -1) {
                            this.personas[index].subscriberTokbox = res.subscriber;
                            this.$rootScope.$broadcast('personaSubscriberUpdate', { guid: newPersona.guid });
                        }
                    });
                    return false;
                }
                return true;
            });
            // if we found that ubsubscribed stream, we can splice it out of unsubscribedStreams
            if (matchedStreamIndex) {
                this.unsubscribedStreamsEvents.splice(matchedStreamIndex, 1);
            }
        }
        this.firebaseAppModel.setAtLeastOneStudent(this.atLeastOneStudent());
        this.$timeout(() => { }, 0);
        this.angularCommunicatorService.updatePersonas(this.personas, 'remote');
        return false;
    }

    private setupFirebaseEvents() {
        this.firebaseRoom.on('child_added', snap => this.updatePersonasArrayFromFirebase(snap, 'child_added'));
        this.firebaseRoom.on('child_changed', snap => this.updatePersonasArrayFromFirebase(snap, 'child_changed'));
    }

    // Tokbox letting us know a new video stream was created. If we already have a persona corresponding to the stream,
    // then subscribe, otherwise stick it in the unsubscribedStreams array and we'll subscribe to it later when we get
    // the firebase update with the corresponding persona
    private videoStreamCreated(event) {
        this.$log.debug('[RosterModel.videoStreamCreated]', event);
        if (event.stream.name === 'SCREENSHARE') {
            this.screenshareStream = event.stream;
            return;
        }
        const streamingPersona = this.personaFromRosterByGuid.call(this, event.stream.name);
        if (streamingPersona) {
            this.$log.debug('[RosterModel.videoStreamCreated], about to subscribe: ', streamingPersona);
            this.allStreams[streamingPersona.guid] = event.stream;
            streamingPersona.subscribeToVideo(event.stream).then((res) => {
                const index = this.getPersonasIndexByGuid(streamingPersona.guid);
                if (index > -1) {
                    this.personas[index].subscriberTokbox = res.subscriber;
                    this.$rootScope.$broadcast('personaSubscriberUpdate', { guid: streamingPersona.guid });
                }
            });
        } else {
            this.unsubscribedStreamsEvents.push(event);
        }
    }

    private videoStreamDestroyed(event) {
        this.$log.debug('[RosterModel.videoStreamDestroyed]', event);
        if (event.stream.name === 'SCREENSHARE') {
            this.screenshareStream = null;
            return;
        }
        const streamingPersona = this.personaFromRosterByGuid.call(this, event.stream.name);
        if (streamingPersona) {
            this.$log.debug('[RosterModel.videoStreamDestroyed], NOT about to unsubscribe: ', streamingPersona);
            // streamingPersona.unsubscribeToVideo();
        }
    }

    private getLocalPersona(options) {
        let userGuid;
        try {
            userGuid = localStorage.getItem('user_guid');
        } catch (e) {
            console.error('localStorage error in RosterModelService');
        }
        if (!userGuid) {
            userGuid = this.guidService.generateUUID();
            localStorage.setItem('user_guid', userGuid);
        }
        const personaOptions = {
            name: this.currentUserModel.user.getName(),
            userGroups: this.currentUserModel.user.groups,
            guid: userGuid,
            isLocal: true,
            suppressArchive: false,
            waitingId: options.waitingId,
            isIPadUser: this.iPadService.isIPad(),
            youtubeInteractionPending: this.iPadService.isAwaitingYoutubeInteraction(),
        };
        if (options.secondary) {
            personaOptions.guid += 'SECONDARY';
        }
        if (personaOptions.name === 'hideVideo') {
            personaOptions.suppressArchive = true;
        }
        Object.assign(personaOptions, options);
        const persona = new this.personaModel(personaOptions, false, this, this.tokboxService);
        this.localPersonaGuids.push(persona.guid);
        return persona;
    }

    addPersonaListener = (personaListener) => {
        this.personaListeners.push(personaListener);
    }

    personaUpdated = (persona) => {
        for (let i = 0; i < this.personaListeners.length; i++) {
            this.personaListeners[i].personaUpdated(persona);
        }
    }

    private waitingVideoStreamCreated(event) {
        const waitingPersona = this.waitingPersonas.find(persona => persona.guid === event.stream.name);
        if (waitingPersona) {
            this.$log.debug('[RosterModel.waitingVideoStreamCreated], about to subscribe: ', waitingPersona);
            waitingPersona.subscribeToVideo(event.stream).then((res) => {
                //
            });
        }
    }

    private waitingVideoStreamDestroyed(event) {
        // console.log('waitingVideoStreamDestroyed: ', event);
    }

    initTokbox = () => {
        if (!this.tokboxService.connected && !this.tokboxService.connecting) {
            this.tokboxService.initTokbox(null);
        }
        this.tokboxService.getSession().then((session) => {
            session.on({
                streamCreated: (evt) => { this.videoStreamCreated(evt); },
                streamDestroyed: (evt) => { this.videoStreamDestroyed(evt); },
            });
        });

        this.tokboxWaitingRoomService.getSession().then((session) => {
            session.on({
                streamCreated: (evt) => { this.waitingVideoStreamCreated(evt); },
                streamDestroyed: (evt) => { this.waitingVideoStreamDestroyed(evt); },
            });
        });
    }

    initializeLocalPersona = (personaOptions) => {
        if (this.localPersona) {
            return this.localPersona;
        }

        this.localPersona = this.getLocalPersona(personaOptions);
        this.setupFirebaseEvents.call(this);

        this.initTokbox();

        this.localPersonas.push(this.localPersona);
        this.angularCommunicatorService.updatePersonas(this.localPersonas, 'local');
        this.firebaseAppModel.setAtLeastOneStudent(this.atLeastOneStudent());
        this.onAddPersona(this.localPersona);
        return this.localPersona.addToRoom();
    }

    initializeSecondaryLocalPersona = (personaOptions) => {
        if (this.localPersona2) {
            return this.localPersona2;
        }
        personaOptions.secondary = true;
        personaOptions.muted = true;
        this.localPersona2 = this.getLocalPersona(personaOptions);
        this.localPersonas.push(this.localPersona2);
        this.angularCommunicatorService.updatePersonas(this.localPersonas, 'local');
        this.firebaseAppModel.setAtLeastOneStudent(this.atLeastOneStudent());
        this.onAddPersona(this.localPersona2);
        return this.localPersona2.addToRoom();
    }

    startSecondaryVideo = () => {
        this.initializeSecondaryLocalPersona({
            state: 'admitted',
            waitingId: '',
        });
        if (this.localPersona2) {
            this.localPersona.updateSecondCameraState();
            // wait a tick for the directive to update, or startVideo will fail to find its vidWrapper
            this.$timeout(() => {
                this.localPersona2.startVideo();
            });
        }
    }

    makeSecondaryPrimary = () => {
        if (this.localPersona2) {
            const videoDevice = this.localPersona2.videoDevice;
            this.localPersona2.stopVideo().then(() => {
                this.localPersona.startVideo(videoDevice);
                this.localPersona2 = null;
                this.localPersonas = [this.localPersona];
                this.angularCommunicatorService.updatePersonas(this.localPersonas, 'local');
                this.onAddPersona(this.localPersona);
            });
        }
    }

    showQualityAlert = (subscriber) => {
        return this.tokboxService.getQualityScore(subscriber);
    }

    atLeastOneStudent = () => {
        return this.personas.some((persona) => {
            return (persona.userGroups.includes('student') ||
                persona.userGroups.includes('Student')) ? true : false;
        });
    }

    getIPadStudents = () => {
        return this.personas
         .filter(persona => persona.userGroups.includes('student') && persona.isIPadUser);
    }

    getIPadStudentsPendingYoutubeInteraction = () => {
        return this.getIPadStudents().filter(student => student.youtubeInteractionPending);
    }
}

videosModule.service('rosterModelService', RosterModelService);
