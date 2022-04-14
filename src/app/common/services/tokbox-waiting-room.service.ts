import { WaitingRoomResolver } from '@common/resolvers/WaitingRoomResolver';
import { RoomResolver } from '@common/resolvers/RoomResolver';

export class TokboxWaitingRoomService {
    static $inject = ['$http', '$q', '$state', '$stateParams',
        'applications', 'currentUserModel',
        'roomnameModel', 'drfRoomModel', 'waitingRoomModel', 'authenticationService', 'tokboxConnectionManagerService'];

    _session: any;

    loginConnnections: any = {};
    browserIds: any = {};
    connectionManager: any;

    publishedVideos = [];

    constructor ($http,
                 private $q,
                 $state,
                 $stateParams,
                 applications,
                 currentUserModel,
                 roomnameModel,
                 drfRoomModel,
                 waitingRoomModel,
                 private authenticationService,
                 TokboxConnectionManagerService) {

        const options: any = {
            ipWhitelist: true,
        };

        let resolver;
        if (typeof OT === 'undefined') {
            console.warn('OT script failed');
            return;
        }
        if (roomnameModel.value) {
            this._session = OT.initSession(roomnameModel.value.tokbox_api_key,
                                           roomnameModel.value.tokbox_waiting_room_session_id, options);
            resolver = new RoomResolver($q, $state, currentUserModel.user, drfRoomModel, roomnameModel, $stateParams);
            this.connectionManager = new TokboxConnectionManagerService(this._session, resolver,
                                                                        roomnameModel.value.tokbox_waiting_room_token);
        } else {
            this._session = OT.initSession(waitingRoomModel.value.tokbox_api_key,
                                           waitingRoomModel.value.tokbox_session_id, options);
            resolver = new WaitingRoomResolver($q, $http, $state, $stateParams, applications, waitingRoomModel);
            this.connectionManager =
                new TokboxConnectionManagerService(this._session, resolver, waitingRoomModel.value.tokbox_token);
        }
    }

    awaitStudentLogin(loginCallback, cancelLoginCallback) {
        this.initTokbox(null).then(() => {
            this.signal({ }, 'clinicanEntered');
            this._session.on('signal:login', (event) => {
                this.browserIds[event.data.browserId] = event.data.browserId;
                this.loginConnnections[event.data.browserId] = event.from;
                loginCallback(event.data.name, event.data.browserId, event.data.isIpad);
            });
            this._session.on('signal:cancel-login', (event) => {
                cancelLoginCallback(event.data.browserId);
            });
        });
    }

    admitStudent(id, name) {
        const deferred = this.$q.defer();
        let entering = false;

        const conn = this.loginConnnections[id];
        this.authenticationService.getStudentToken(name, id).then((token) => {
            const enteringId = 'entering' + id;
            this._session.on('signal:' + enteringId, (event) => {
                entering = true;
                this._session.off('signal:' + enteringId);
                deferred.resolve();
            });
            setTimeout(() => {
                if (!entering) {
                    deferred.reject();
                }
            }, 5000);
            this._session.signal(
                {
                    to: conn,
                    type: 'admit',
                    data: token,
                },
                (error) => {
                    if (error) {
                        console.log(`signal error (${error.name}): ${error.message}`);
                    }
                },
              );
        });

        return deferred.promise;
    }
    denyStudent(id, name) {
        const conn = this.loginConnnections[id];

        this._session.signal(
            {
                to: conn,
                type: 'dismiss',
            },
            (error) => {
                if (error) {
                    console.log(`signal error (${error.name}): ${error.message}`);
                }
            },
            );
    }

    unawaitAdmission() {
        this._session.off('signal:admit');
        this._session.off('signal:dismiss');
        this._session.off('signal:clinicanEntered');
    }

    awaitAdmission(name, browserId, isIpad, admitCallback, dismissCallback) {
        this.signal({ name, browserId, isIpad }, 'login');
        this._session.on('signal:admit', (event) => {
            this.signal({ name, browserId, isIpad }, 'entering' + browserId);
            this.unawaitAdmission();
            admitCallback(event.data, event.from.id);
        });
        this._session.on('signal:dismiss', (event) => {
            this.unawaitAdmission();
            dismissCallback(event.data, event.from.id);
        });
        this._session.on('signal:clinicanEntered', (event) => {
            this.signal({ name, browserId, isIpad }, 'login');
        });
    }

    cancelAwaitAdmission(browserId) {
        this.signal({ browserId }, 'cancel-login');
        this.unawaitAdmission();
    }

    signal = (data, type, connection?: any) => {
        this._session.signal(
            { data, type },
            (error) => {
                if (error) {
                    console.log(`signal error (${error.name}): ${error.message}`);
                }
            },
          );
    }

    initTokbox(previousDeferred) {
        return this.connectionManager.initTokboxConnection(previousDeferred);
    }

    getSession = function(prevDeferred) {
        const deferred = prevDeferred ? prevDeferred : this.$q.defer();

        if (!this._session) {
            console.log('session not ready yet, retrying');
            this.$timeout(() => {
                this.getSession(deferred);
            },
                          500);

            // TODO - necessary?
            return deferred.promise;
        }
        deferred.resolve(this._session);
        return deferred.promise;
    };

    subscribe = (stream, element, config, error) => {
        const subscriber = this._session.subscribe(stream, element, config, error);
        return subscriber;
    }

    publish = (videoPublisher, handler) => {
        this._session.publish(videoPublisher.publisher, handler);
        this.publishedVideos.push(videoPublisher);
    }

    unpublish = (videoPublisher) => {
        try {
            this._session.unpublish(videoPublisher.publisher);
        } catch (error) {
            console.log('error unpublishing: ', error);
        }
        const index = this.publishedVideos.indexOf(videoPublisher);
        if (index !== -1) {
            this.publishedVideos.splice(index, 1);
        }
    }

}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('tokboxWaitingRoomService', TokboxWaitingRoomService);
