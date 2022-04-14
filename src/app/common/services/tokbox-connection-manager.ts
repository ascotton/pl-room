
const TokboxConnectionManagerService = function($log, $q, $timeout, remoteLogging, angularCommunicatorService) {

    class TokboxConnectionManager {

        readonly MAX_TOKBOX_CONNECT_RETRIES = 5;
        tokboxConnectRetries = 0;
        connecting = false;
        expiredToken = false;
        connected = false;

        lastInitError = {
            code: '',
            message: '',
        };

        constructor(private session, private roomResolver, private tokboxToken) {
        }

        initTokboxConnection = (previousDeferred) => {
            let deferred = previousDeferred;
            if (!deferred) {
                deferred = $q.defer();
                this.connecting = true;
                this.lastInitError = {
                    code: '',
                    message: '',
                };
            }
            let tokboxConnectCallback = false;

            if (!this.session || OT === undefined) {
                console.log('OT not ready yet, retrying');
                $timeout(
                    () => {
                        this.initTokboxConnection(deferred);
                    },
                    500);
                return deferred.promise;
            }

            // In the event that session.connect flakes out and never invokes the callback,
            // do a disconnect and retry, up to MAX_TOKBOX_CONNECT_RETRIES
            $timeout(
                () => {
                    if (!tokboxConnectCallback) {
                        $log.debug(`[TokboxModel.initTokbox().connect()] CONNECT TIMED OUT, RETRY`);
                        this.retryInitTokboxConnection(deferred);
                    }
                },
                10000,
            );

            // tokbox.session.connect is pretty flaky, sometimes the callback never happens. tokboxConnectCallback flag
            // indicates when it has called back, even if in error.
            this.session.connect(this.tokboxToken, (error) => {
                tokboxConnectCallback = true;
                if (error) {
                    $log.error('[TokboxModel.initTokbox()] Error connecting, may retry: ', error.code, error.message);
                    this.lastInitError = error;

                    const delayedRetry = () => {
                        $timeout(
                            () => {
                                this.retryInitTokboxConnection(deferred);
                            },
                            this.tokboxConnectRetries * 200,
                        );
                    };

                    // on an expired token error (1004), refetch the room
                    if (error.code === 1004) {
                        remoteLogging.logTokboxErrorToSentry(
                            `[TokboxModel.initTokbox().connect()] expired token, re-fetching room and retrying`,
                            this.session, error);
                        this.expiredToken = true;
                        this.roomResolver.resolveRoom(null).then(
                            (room) => {
                                delayedRetry();
                            });
                    } else {
                        delayedRetry();
                    }
                } else {
                    $log.log('[TokboxModel.initTokbox()] Connected to the session: ', this.session);
                    this.connected = true;
                    this.connecting = false;
                    angularCommunicatorService.updateTokboxConnected(this.connected);
                    if (this.expiredToken) {
                        this.expiredToken = false;
                        remoteLogging.logTokboxErrorToSentry(
                            `[TokboxModel.initTokbox().connect()] expired token resolved`, this.session);
                    }
                    deferred.resolve();
                }

            });
            return deferred.promise;
        }

        retryInitTokboxConnection = (deferred) => {
            $log.log(`[TokboxModel.initTokbox().connect()] BAD CONNECT, RETRYING ${++this.tokboxConnectRetries} of
                ${this.MAX_TOKBOX_CONNECT_RETRIES}`);
            if (this.tokboxConnectRetries <= this.MAX_TOKBOX_CONNECT_RETRIES) {
                this.session.disconnect();
                this.initTokboxConnection(deferred);
            } else {
                this.tokboxConnectRetries = 0;
                // this.remoteLogging.logTokboxErrorToSentry(
                //     `[TokboxModel.initTokbox().connect()] tokboxConnectRetries maxed out, last error: `,
                //     this.session, this.lastInitError);
                $log.debug('[TokboxModel.initTokbox().connect()] ** BAD STATE ** COULD NOT CONNECT');
                this.connecting = false;
                deferred.reject('Unable to connect to tokbox');
            }
        }
    }

    return TokboxConnectionManager;
};
TokboxConnectionManagerService.$inject = ['$log', '$q', '$timeout', 'remoteLogging', 'angularCommunicatorService'];

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('tokboxConnectionManagerService', TokboxConnectionManagerService);
