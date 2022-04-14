import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ConferenceService } from '@room/conference';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { roomModule } from '@room/room.module';

export const RECORD_STREAM_ID = 'SESSION_RECORD_SCREENSHARE';

export class TokboxRecordService {
    static $inject = [
        '$q',
        '$log',
        'currentUserModel',
        'roomnameModel',
        '$http',
        'plUrlsService',
        'firebaseAppModel',
        'ngrxStoreService',
        'dispatcherService',
        'conferenceService',
    ];

    tokboxIsRecording = false;
    currentArchiveId = null;
    tokboxApiKey = '';
    sessionId = '';
    videoUrl = '';
    archiveName = '';
    tokboxEnvironment = 'enterprise';

    lastInitError = {
        code: '',
        message: '',
    };
    firebaseRef: any;

    recordingList: any[];
    recordingDictionary: {};
    screensharing: boolean;
    archiveFetchAttemptCount = 0;

    constructor (
        private $q: angular.IQService,
        private $log,
        private currentUserModel,
        roomnameModel,
        private $http,
        private plUrls,
        private firebaseAppModel,
        private ngrxStoreService: Store<AppState>,
        private dispatcherService,
        private conferenceService: ConferenceService,
    ) {
        this.tokboxApiKey = roomnameModel.value.tokbox_api_key;
        this.sessionId = roomnameModel.value.tokbox_session_id;
        this.tokboxEnvironment = roomnameModel.value.tokbox_environment;

        // TODO - upgrade this service for direct use by the drawer ng2 component
        ngrxStoreService.select('tokboxRecord').subscribe(
            (data: any) => {
                if (!data) {
                    return;
                }
                const type = data.type;
                const payload = data.payload;
                switch (type) {
                        case 'TOKBOX_RECORD_TOGGLE':
                            this.handleRecordToggle(payload);
                            return;
                        case 'TOKBOX_SCREENSHARE_TOGGLE':
                            this.handleScreenshareToggle(payload);
                            return;
                }
            },
        );
        dispatcherService.addListener('firebaseAppModelChange', null, this.handleFirebaseAppModelChange, this);
    }

    handleFirebaseAppModelChange = (val) => {
        this.checkForRecording();
        this.dispatcherService.removeListener('firebaseAppModelChange', null, this.handleFirebaseAppModelChange, this);
    }

    checkForRecording = () => {
        if (!this.currentUserModel.user.isClinicianOrExternalProvider()) {
            return;
        }
        const stillRecording = this.firebaseAppModel.app.tokboxIsRecording;
        if (stillRecording) {
            const recordingProps = this.firebaseAppModel.app.tokboxRecordingProperties;
            if (recordingProps && recordingProps.providerId === this.currentUserModel.user.uuid) {
                this.getTokboxArchive(recordingProps.archiveId).then((archive: any) => {
                    if (archive.status === 'started' || archive.status === 'paused') {
                        this.$log.info('Recovering existing unstopped archive: ', archive);
                        this.stopTokboxRecording(recordingProps.archiveId, recordingProps.clientIDs,
                                                 recordingProps.record).then(
                            this.handleRecoverySuccess(recordingProps),
                            (error) => { this.handleRecoveryFailure(recordingProps, error); },
                        );
                    } else if (archive.status === 'available' || archive.status === 'uploaded') {
                        this.$log.info('Recovering existing completed archive: ', archive);
                        this.postRecordingResult(archive, recordingProps.clientIDs, recordingProps.record).then(
                            this.handleRecoverySuccess(recordingProps),
                            (error) => { this.handleRecoveryFailure(recordingProps, error); },
                        );
                    } else if (archive.status === 'expired' || archive.status === 'failed') {
                        this.$log.info('Failing to recover existing failed archive: ', archive);
                        this.handleRecoveryFailure(recordingProps, 'Archive ' + archive.status);
                    }
                });
            }
        }
    }

    handleScreenshareToggle = (payload) => {
        if (payload.screensharing) {
            this.startScreensharing();
        } else {
            this.conferenceService.stopScreenshare(RECORD_STREAM_ID);
            this.screensharing = false;
        }
    }

    handleRecordToggle = (payload) => {
        this.tokboxIsRecording = payload.recording;
        this.firebaseAppModel.setTokboxIsRecording(payload.recording);
        if (payload.recording) {
            this.startTokboxRecording().then((archiveId) => {
                this.firebaseAppModel.setTokboxRecordingProperties(
                    { archiveId, clientIDs: payload.clientIDs, record: payload.record,
                        providerId: this.currentUserModel.user.uuid});
            });
        } else {
            this.stopTokboxRecording(this.currentArchiveId, payload.clientIDs, payload.record);
        }
    }

    private handleRecoveryFailure(recordingProps: any, error: any): any {
        this.firebaseAppModel.setTokboxIsRecording(false);
        this.firebaseAppModel.setTokboxRecordingProperties(null);
        this.ngrxStoreService.dispatch({
            type: 'TOKBOX_RECORDING_SALVAGE',
            payload: {
                error,
                success: false,
                clientIds: recordingProps.clientIDs,
                archiveId: recordingProps.archiveId,
            },
        });
    }

    private handleRecoverySuccess(recordingProps: any): any {
        this.firebaseAppModel.setTokboxIsRecording(false);
        this.firebaseAppModel.setTokboxRecordingProperties(null);
        this.ngrxStoreService.dispatch({
            type: 'TOKBOX_RECORDING_SALVAGE',
            payload: {
                success: true,
                clientIds: recordingProps.clientIDs,
                archiveId: recordingProps.archiveId,
            },
        });
    }

    setLayoutClassesForStream = (streamId: any, classes: string[]) => {
        const deferred = this.$q.defer();
        this.videoUrl = `${this.plUrls.urls.video}`;

        this.videoUrl = `${this.plUrls.urls.video}`;
        const data = {
            method: 'put',
            url: `${this.videoUrl}session/${this.sessionId}/stream`,
            data: {
                items: [
                    {
                        id: streamId,
                        layoutClassList: classes,
                    },
                ],
            },
            headers: {
                'X-Tokbox-Env': this.tokboxEnvironment,
            },
        };
        this.$http(data).then(
            (result) => {
                deferred.resolve(result.data);
            },
            (error) => {
                deferred.reject(error);
                this.$log.error('setLayoutClassesForStream error: ', error);
            });
        return deferred.promise;

    }

    startScreensharing = () => {
        this.conferenceService.startScreenshare(RECORD_STREAM_ID).pipe(
            switchMap(() => {
                const streamId = this.conferenceService.getProviderId(RECORD_STREAM_ID);
                return from(this.setLayoutClassesForStream(streamId, ['screenshareVideo']));
            }),
        )
        .subscribe(
            () => {
                this.ngrxStoreService.dispatch({
                    type: 'TOKBOX_SCREENSHARE_UPDATE',
                    payload: {
                        success: true,
                    },
                });
            },
            (error) => {
                this.ngrxStoreService.dispatch({
                    type: 'TOKBOX_SCREENSHARE_UPDATE',
                    payload: {
                        error,
                        success: false,
                    },
                });
            },
        );
        this.screensharing = true;
    }

    startTokboxRecording = () => {
        const deferred = this.$q.defer();
        this.videoUrl = `${this.plUrls.urls.video}`;
        this.archiveName = this.currentUserModel.user.username + moment.utc().format();

        const stylesheet =
            `archive {
                position: relative;
                margin:0;
                width: 1280px;
                height: 720px;
                overflow: hidden;
            }
            stream {
                display: block;
                width: 1%;
                height: 1%;
            }
            stream.screenshareVideo {
                width: 100%;
                height: 100%;
            }`;

        const data = {
            method: 'post',
            url: this.videoUrl + 'archive/',
            headers: {
                'X-Tokbox-Env': this.tokboxEnvironment,
            },
            data: {
                sessionId: this.sessionId,
                uid: this.archiveName,
                hasAudio : true,
                hasVideo : true,
                layout : {
                    stylesheet,
                    type: 'custom',
                },
                outputMode : 'composed',
                resolution : '1280x720',
            },
        };

        this.$http(data).then(
            (result) => {
                this.currentArchiveId = result.data.id;
                deferred.resolve(result.data.id);
            },
            (error) => {
                deferred.reject(error);
                this.$log.error('startTokboxRecording error: ', error);
            });
        return deferred.promise;
    }
    stopTokboxRecording = (archiveId, clientIDs, record) => {
        this.videoUrl = `${this.plUrls.urls.video}`;
        const deferred = this.$q.defer();
        const data = {
            method: 'post',
            url: `${this.videoUrl}archive/${archiveId}/stop`,
            data: {
                uid: this.archiveName,
            },
            headers: {
                'X-Tokbox-Env': this.tokboxEnvironment,
            },
        };
        try {
            this.$http(data).then((result) => {
                this.getTokboxArchive(archiveId).then(
                    (getRecordingResult) => {
                        this.postRecordingResult(result.data, clientIDs, record).then((postedRecordingResult) => {
                            deferred.resolve(result.data);
                            // this.getRecordingViewURL(postedRecordingResult.uuid);
                            // this.getClientRecordings(clientIDs[0]);
                        },
                    );
                    },
                );

            },                    (error) => {
                deferred.reject(error);
                this.$log.error('stopTokboxRecording error: ', error);
            });
        } catch (err) {
            deferred.reject(err);
            console.log('caught exception stopping recording: ', err);
        }
        return deferred.promise;
    }

    postRecordingResult = (recordingResult: any, clientIDs: string[], record: any) => {
        const deferred = this.$q.defer();
        const recordingUrl = this.plUrls.urls.recording;
        const clientList = clientIDs.map((id) => {
            return { client: id };
        });
        const recordingData = {
            method: 'post',
            url: recordingUrl,
            data: {
                clients: clientList,
                provider: this.currentUserModel.user.uuid,
                record: record.uuid,
                status: 'stopped',
                tokbox_env_origin: 'enterprise',
                tokbox_archive_id: recordingResult.id,
            },
            headers: {
                'X-Tokbox-Env': this.tokboxEnvironment,
            },
        };
        this.$http(recordingData).then((recordingPostResult) => {
            deferred.resolve(recordingPostResult.data);
        },                             (response: any) => {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    /**
     * Retrieve the viewable url for the recording
     */
    // getRecordingViewURL(recordingId) {
    //     const recordingUrl = `${this.plUrls.urls.recording}`;
    //     const deferred = this.$q.defer();
    //     const data = {
    //         method: 'get',
    //         url: `${recordingUrl}${recordingId}/get_view_url`,
    //         headers: {
    //             'X-Tokbox-Env': this.tokboxEnvironment,
    //         },
    //     };
    //     this.$http(data).then((result) => {
    //         deferred.resolve(result.data);
    //     });
    //     return deferred.promise;
    // }

    /**
     * Retrieve the records of recordings for this client
     */
    // getClientRecordings(clientId) {
    //     // GET <platform>/api/v3/recording/?client=<client uuid>
    //     const recordingUrl = `${this.plUrls.urls.recording}`;
    //     const deferred = this.$q.defer();
    //     const data = {
    //         method: 'get',
    //         url: `${recordingUrl}?client=${clientId}`,
    //         headers: {
    //             'X-Tokbox-Env': this.tokboxEnvironment,
    //         },
    //     };
    //     this.$http(data).then((result) => {
    //         deferred.resolve(result.data);
    //     });
    //     return deferred.promise;
    // }

    /**
     * Attempt to retrieve the tokboxArchive. If the status is not yet 'available' or 'uploaded',
     * wait 1 second and try again. If 'expired' give up. Also give up after 100 unsuccessful tries.
     */
    getTokboxArchive = (archiveId, shouldRetry?: boolean, previousDeferred?: any) => {
        if (previousDeferred) {
            this.archiveFetchAttemptCount++;
        } else {
            this.archiveFetchAttemptCount = 0;
        }
        this.videoUrl = `${this.plUrls.urls.video}`;
        const deferred = previousDeferred || this.$q.defer();
        const data = {
            method: 'get',
            url: `${this.videoUrl}archive/${archiveId}`,
            headers: {
                'X-Tokbox-Env': this.tokboxEnvironment,
            },
        };
        this.$http(data).then((response) => {
            if (shouldRetry) {
                if (response.data.status === 'available' || response.data.status === 'uploaded') {
                    deferred.resolve(response.data);
                } else if (response.data.status === 'expired' || this.archiveFetchAttemptCount > 100) {
                    deferred.resolve(null);
                } else {
                    setTimeout(() => {
                        this.getTokboxArchive(archiveId, true, deferred);
                    },         1000);
                }
            } else {
                deferred.resolve(response.data);
            }
        },                    (response) => {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    private handleStoppedRecording(archiveId: any, result: any, clientIDs: any, record: any) {
        const deferred = this.$q.defer();
        this.getTokboxArchive(archiveId, true).then((getRecordingResult) => {
            this.postRecordingResult(result.data, clientIDs, record).then((postedRecordingResult) => {
                deferred.resolve(result.data);
            });
        });
        return deferred.promise;
    }
}

roomModule.service('tokboxRecordService', TokboxRecordService);
