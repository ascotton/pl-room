import { videosModule } from './videos.module';

const VideoPublisherService = function ($log, $q, $timeout, remoteLogging, deviceManager, filteredCanvasService) {
    class VideoPublisher {
        retryAttempts: number;
        publishing: boolean;
        audioDevice: any;
        videoDevice: any;
        publisher: any;
        streamCreated: boolean;
        muted: any;
        isSecondary = false;
        tokboxService: any;
        filteredCanvas: any;

        constructor(id, tokboxService) {
            Object.assign(this, {
                id,
                publishing: false,
                streamCreated: false,
                muted: false,
                publisher: null,
                audioDevice: null,
                videoDevice: null,
            });
            this.retryAttempts = 0;
            this.tokboxService = tokboxService;
        }

        private async initPublisher(element, name, blur, audioSource, videoSource) {
            const deferred = $q.defer();
            const videoPromise = new Promise(
                (resolve, reject) => {
                    if (blur) {
                        OT.getUserMedia({ videoSource: this.videoDevice }).then((mediaStream) => {
                            this.filteredCanvas = filteredCanvasService.getFilteredCanvas(mediaStream);
                            const filteredVideo = this.filteredCanvas.canvas.captureStream(15).getVideoTracks()[0];
                            resolve(filteredVideo);
                        });
                    } else {
                        resolve(videoSource);
                    }
                },
            );
            const actualVideoSource = await videoPromise;

            const options: any = {
                name,
                audioSource,
                videoSource: actualVideoSource,
                width: '100%',
                height: '100%',
                resolution: '640x480',
                top: 0,
                left: 0,
                insertMode: 'append',
                frameRate: 15,
                showControls: false,
            };
            if (videoSource === 'window') {
                options.resolution = '1280x720';
            }
            const actualElement = element[0] ? element[0] : element;
            this.publisher = OT.initPublisher(
                actualElement,
                options,
                (error2) => {
                    if (error2) {
                        $log.debug('[VideoPublisherService] error on init publisher: ', error2);
                        deferred.reject(error2);
                    } else {
                        $log.debug('[VideoPublisherService] init publisher');

                        this.publisher.on({
                            accessDialogOpened: (event) => {
                                // Show allow camera message
                                $timeout(() => { this.tokboxService.cameraPermissionsVisible = true; });
                            },
                            accessDialogClosed: (event) => {
                                // Hide allow camera message
                                $timeout(() => { this.tokboxService.cameraPermissionsVisible = false; });
                            },
                            destroyed: (event) => {
                                this.streamCreated = false;
                                this.publishing = false;
                                this.publisher = null;
                                $log.debug('[VideoPublisherService] local publish stream destroyed: ', event);
                            },
                        });

                        // setup publisher listeners
                        this.publisher.once({
                            streamCreated: (event) => {
                                $log.debug('[VideoPublisherService] local publish stream created: ', event);
                                this.streamCreated = true;
                            },
                            exception: (exception) => {
                                $log.debug('[VideoPublisherService] local publish exception handler: ', exception);
                            },
                        });
                        deferred.resolve(actualVideoSource);
                    }
                });

            return deferred.promise;
        }

        screenshare(element, guid, recoverCallback) {
            const deferred = $q.defer();
            this.isSecondary = true;

            if (this.publishing) {
                deferred.resolve();
            }

            function retry() {
                $log.debug('[VideoPublisherService] retry');
                $timeout(() => {
                    this.tokboxService.initTokbox().then(() => {
                        $log.debug(
                            // tslint:disable-next-line:max-line-length
                            '[VideoPublisherService] tokbox session re-initialized in retry, calling recoverCallback',
                        );
                        if (recoverCallback) recoverCallback();
                    });
                }, (this.retryAttempts + 1) * 200);
            }

            this.initPublisher(element, guid, false, null, 'window').then(
                (result) => {
                    const that = this;
                    this.publisher.publishAudio(false);
                    this.tokboxService.publish(this, (error2) => {
                        if (error2) {
                            console.log('[VideoPublisherService] ** ERROR**  screenshare publish: ', error2);
                            remoteLogging.logTokboxErrorToSentry('VideoPublisherService tokbox local publish failed',
                                this.tokboxService.session, error2);
                            this.publishing = false;
                            deferred.reject(error2);
                            retry.bind(that)();
                        } else {
                            console.log('[VideoPublisherService] --SUCCESS-- screenshare publish ');
                            this.publishing = true;
                            deferred.resolve(this.videoDevice);
                        }
                    });
                },
                (error) => {
                    console.log('screenshare initPublisher rejected: ', error);
                    deferred.reject(error);
                },
            );
            return deferred.promise;
        }

        publish(element, guid, blur, isSecondary, republish, recoverCallback, suggestedVideoDevice, findAfterVideoDevice) {
            const deferred = $q.defer();
            this.isSecondary = isSecondary;
            if (isSecondary) {
                blur = false;
            }

            if (this.publishing && !isSecondary) {
                deferred.resolve();
            }

            if (republish) {
                if (this.videoDevice) {
                    suggestedVideoDevice = this.videoDevice;
                } else {
                    $log.error('republishing but videoDevice is null: ', this.videoDevice);
                }
                this.retryAttempts++;
                if (this.retryAttempts > 5) {
                    deferred.reject(
                        `[VideoPublisherService] Aborting publish after ${this.retryAttempts} attempts.`,
                    );
                }
            } else {
                this.retryAttempts = 0;
            }

            deviceManager.getDevices(suggestedVideoDevice, findAfterVideoDevice, isSecondary).then(
                async (devices) => {
                    this.audioDevice = devices.audioDevice;
                    this.videoDevice = devices.videoDevice;
                    $log.debug('[VideoPublisherService] use audioDevice: ', this.audioDevice);
                    $log.debug('[VideoPublisherService] use videoDevice: ', this.videoDevice);

                    const audioSource = isSecondary ? null : this.audioDevice.deviceId;
                    const actualVideoDevice =
                        await this.initPublisher(element, guid, blur, audioSource, this.videoDevice.deviceId);

                    const retry = () => {
                        $log.debug('[VideoPublisherService] retry');
                        $timeout(() => {
                            this.tokboxService.initTokbox().then(() => {
                                $log.debug(
                                    '[VideoPublisherService] tokbox session re-initialized in retry, calling recoverCallback',
                                );
                                recoverCallback();
                            });
                        }, (this.retryAttempts + 1) * 200);
                    }

                    this.tokboxService.publish(this, (error2) => {
                        if (error2) {
                            $log.debug('[VideoPublisherService] ** ERROR**  local publish: ', error2);
                            remoteLogging.logTokboxErrorToSentry(
                                'VideoPublisherService tokbox local publish failed',
                                this.tokboxService.session, error2);
                            this.publishing = false;
                            deviceManager.freeDevice(this.videoDevice);
                            retry();
                        } else {
                            $log.debug('[VideoPublisherService] --SUCCESS-- local publish ');
                            this.retryAttempts = 0;
                            this.publishing = true;
                            deviceManager.claimDevice(this.videoDevice, isSecondary);

                            setTimeout(() => {
                                deferred.resolve(this.videoDevice);
                            })
                        }
                    });
                },
                (getDevicesError) => {
                    $log.debug('[VideoPublisherService] ** ERROR**  couldn\'t find devices to publish: ',
                               getDevicesError);
                    deferred.reject(getDevicesError);
                },
            );
            return deferred.promise;
        }

        unpublish(freeDevice?: boolean) {
            const deferred = $q.defer();
            if (this.publishing && this.streamCreated && this.publisher) {
                this.publisher.on('streamDestroyed', (e) => {
                    $log.debug('[VideoPublisherService.unpublish()] AFTER streamDestroyed');
                    if (e.stream.streamId === this.publisher.streamId) {
                        // e.preventDefault();
                        this.streamCreated = false;
                        this.publishing = false;
                        this.publisher = null;
                        if (freeDevice) {
                            deviceManager.freeDevice(this.videoDevice);
                        }
                        deferred.resolve();
                    }
                });
                this.tokboxService.unpublish(this);
                if (this.filteredCanvas) {
                    this.filteredCanvas.stop();
                }
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        mute(state) {
            if (this.publisher) {
                if (!this.isSecondary) {
                    this.publisher.publishAudio(!state);
                }
                this.muted = state;
            }
        }

        forceDisconnect(connection, completionHandler) {
            this.tokboxService.forceDisconnect(connection, completionHandler);
        }
    }

    return VideoPublisher;
};
VideoPublisherService.$inject = ['$log', '$q', '$timeout', 'remoteLogging', 'deviceManager', 'filteredCanvasService'];

videosModule.service('videoPublisherService', VideoPublisherService);
