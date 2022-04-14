import { videosModule } from './videos.module';
import * as moment from 'moment';
import { RoomResolver } from '@common/resolvers/RoomResolver';

export class TokboxService {
    static $inject = ['$q', '$state', '$stateParams', '$timeout', 'currentUserModel',
        'roomnameModel', 'drfRoomModel', 'tokboxConnectionManagerService', 'angularCommunicatorService'];

    publishedVideos = [];
    _session: any;
    connectionManager: any;

    constructor (private $q, private $state, private $stateParams, private $timeout,
                 private currentUserModel, private roomnameModel, private drfRoomModel,
                 TokboxConnectionManagerService, private angularCommunicatorService) {
        const options: any = {
            ipWhitelist: true,
        };
        this._session = OT.initSession(roomnameModel.value.tokbox_api_key,
                                       roomnameModel.value.tokbox_session_id, options);

        const resolver = new RoomResolver($q, $state, currentUserModel.user,
                                          drfRoomModel, roomnameModel, $stateParams);
        this.connectionManager =
            new TokboxConnectionManagerService(this._session, resolver, roomnameModel.value.tokbox_token);
    }

    initTokbox = (previousDeferred) => {
        return this.connectionManager.initTokboxConnection(previousDeferred);
    }

    get connected() {
        return this.connectionManager.connected;
    }

    set connected(val) {
        this.connectionManager.connected = val;
        this.angularCommunicatorService.updateTokboxConnected(val);
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

    

    subscribe = (stream, element, config, error) => {
        const subscriber = this._session.subscribe(stream, element, config, error);
        return subscriber;
    }

    unsubscribe = (subscriber) => {
        this._session.unsubscribe(subscriber);
    }

    getQualityScore = (subscriber) => {
    }

    shutdown = () => {
        const defer = this.$q.defer();
        // stop publishing
        const unpublishPromises = [];
        this.publishedVideos.forEach((video) => {
            unpublishPromises.push(video.unpublish());
        });
        this.$q.all(unpublishPromises).then(() => {
            if (this._session) {
                this._session.disconnect();
            }
            this.connectionManager.connected = false;
            this.angularCommunicatorService.updateTokboxConnected(false);
            defer.resolve();
        });
        return defer.promise;
    }

    forceDisconnect = (connection, completionHandler) => {
        if (connection) {
            console.log('forceDisconnect connection: ', connection);
            return this._session.forceDisconnect(connection, completionHandler)
        } else {
            console.log('forceDisconnect, no connection');
            completionHandler(Error('forceDisconnect failed, no connection'));
        }
    }
}

videosModule.service('tokboxService', TokboxService);
