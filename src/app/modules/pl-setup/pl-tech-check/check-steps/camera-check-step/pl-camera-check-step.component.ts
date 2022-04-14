import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DevicesHistoryService } from '@root/src/app/common/media';
import { StreamType } from '@root/src/app/modules/room/conference/store';
import { Subscription } from 'rxjs';
import { PLMultiLanguageService } from '../../../pl-multi-lang.service';
import { CheckResult, CHECK_STATUS, DEVICE_EXCEPTIONS } from '../../pl-tech-check.model';
import { PLTechCheckService } from '../../pl-tech-check.service';
declare var OT: any;

const VIDEO_STATUS = {
    FAILED: 'failed',
    LOADING: 'loading',
    RECORDING: 'recording',
    PLAYING: 'playing',
    READY: 'ready',
    RECORD_READY: 'recordReady',
};

@Component({
    selector: 'pl-camera-check-step',
    templateUrl: 'pl-camera-check-step.component.html',
    styleUrls: ['./pl-camera-check-step.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLCameraCheckStepComponent implements OnInit, OnDestroy {
    @Input() public stepNumber: number;
    @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
    @ViewChild('otVideo', { static: false }) otVideo: ElementRef;
    private readonly RECORD_SECONDS = 5;
    session;
    cameras: MediaDeviceInfo[] = [];
    selectedCamera: string;
    videoStatus = VIDEO_STATUS;
    currentVideoStatus = VIDEO_STATUS.LOADING;
    videoUrl: string;
    secondsLeft = this.RECORD_SECONDS;
    isErrorState = false;
    readonly deviceExceptions = DEVICE_EXCEPTIONS;
    readonly recordingEnabled = false; // Temporarily disabled feature
    private recordInterval;
    private timeoutHandler: NodeJS.Timeout;
    private initialized = false;
    private archiveId: string;
    private publisher;
    private subscriptions: Subscription[] = [];
    constructor(private techCheckService: PLTechCheckService,
                private snackBar: MatSnackBar,
                private multiLangService: PLMultiLanguageService,
                private devicesHistoryService: DevicesHistoryService) { }

    ngOnInit() {
        this.subscriptions.push(
            this.techCheckService.stepStarted$.subscribe((step) => {
                if (step === this.stepNumber) {
                    const permissionsResult = this.techCheckService.results.permissions.camera;
                    if (permissionsResult.status === CHECK_STATUS.FAILED) {
                        this.isErrorState = true;
                        const result = {
                            error: permissionsResult.error,
                            status: CHECK_STATUS.FAILED,
                        };
                        this.setResult(result);
                        return;
                    }
                    if (this.techCheckService.isVideoUrlBlocked()) {
                        this.isErrorState = true;
                        const result = {
                            error: this.deviceExceptions.OPENTOK_ERROR,
                            status: CHECK_STATUS.FAILED,
                        };
                        this.setResult(result);
                        return;
                    }
                    setTimeout(() => {
                        if (this.initialized) {
                            if (this.otVideo) {
                                this.otVideo.nativeElement.innerHtml = '';
                            }
                            this.startVideo();
                        } else {
                            this.getCameraList();
                        }
                        this.initialized = true;
                    },         500);
                } else {
                    this.videoUrl = null;
                    this.currentVideoStatus = VIDEO_STATUS.LOADING;
                    this.unPublishVideo();
                }
            }),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isMultiLangEnabled = () => this.multiLangService.isMultiLangEnabled;

    isCheckCompleted() {
        return this.techCheckService.isStepCompleted(this.stepNumber);
    }

    selectedCameraChanged(id) {
        if (this.publisher) {
            this.publisher.setVideoSource(id);
        }
        this.setDefaultDevice(id);
    }

    startVideo() {
        if (typeof(OT) === 'undefined') {
            const result = {
                status: CHECK_STATUS.FAILED,
                error: 'Opentok script load error.',
            };
            this.setResult(result);
            this.currentVideoStatus = this.videoStatus.READY;
            return;
        }
        this.session = this.techCheckService.getOpenTokSession();
        this.session.disconnect();
        const publisherOptions = {
            showControls: false,
            insertMode: 'append',
            videoSource: this.selectedCamera,
            height: 300,
            width: 400,
            audioSource: null,
            publishAudio: false,
            publishVideo: true,
            mirror: false,
        };
        this.session.connect(this.techCheckService.getOpenTokToken(), (err) => {
            if (err) {
                const result = {
                    status: CHECK_STATUS.FAILED,
                    error: err,
                };
                this.setResult(result);
                this.currentVideoStatus = this.videoStatus.READY;
                return;
            }
            if (this.techCheckService.getCurrentStep() === this.stepNumber) {
                this.publisher = OT.initPublisher('ot-video', publisherOptions, (error) => {
                    if (error) {
                        this.unPublishVideo();
                        const result = {
                            error,
                            status: CHECK_STATUS.FAILED,
                        };
                        this.setResult(result);
                    }
                    this.currentVideoStatus = this.videoStatus.READY;
                });
                this.publisher.on({
                    // http://stackoverflow.com/questions/21559016/opentok-accessdenied-issue-in-chrome
                    accessAllowed: () => {
                        this.session.publish(this.publisher, (error) => {
                            if (!!error) {
                                const result = {
                                    error,
                                    status: CHECK_STATUS.FAILED,
                                };
                                this.setResult(result);
                            }
                        });
                    },
                    accessDenied: () => {
                        this.unPublishVideo();
                        const result = {
                            status: CHECK_STATUS.FAILED,
                            error: 'Camera access denied',
                        };
                        this.setResult(result);
                    },
                });
            }
        });
    }

    onRecordVideo() {
        this.currentVideoStatus = this.videoStatus.RECORDING;
        this.secondsLeft = this.RECORD_SECONDS;
        this.subscriptions.push(
            this.techCheckService.startVideoRecording().subscribe((archiveId) => {
                this.archiveId = archiveId;
                this.recordInterval = setInterval(() => {
                    if (this.secondsLeft > 0) {
                        this.secondsLeft--;
                    }
                },                                1000);
                this.timeoutHandler = setTimeout(() => {
                    this.onStopRecording();
                },                               this.RECORD_SECONDS * 1000);
            }),
        );
    }

    onStopRecording() {
        if (this.recordInterval) {
            window.clearInterval(this.recordInterval);
        }
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
        }
        this.subscriptions.push(
            this.techCheckService.stopRecording(this.archiveId).subscribe((res) => {
                this.session.unpublish(this.publisher);
                this.currentVideoStatus = VIDEO_STATUS.LOADING;
                this.subscriptions.push(
                    this.techCheckService.getVideoArchive(this.archiveId).subscribe((url) => {
                        this.currentVideoStatus = this.videoStatus.RECORD_READY;
                        this.videoUrl = url;
                    }),
                );
            }),
        );
    }

    onAnswerChanged(ev: MatRadioChange) {
        const result: CheckResult = { status: CHECK_STATUS.SUCCEED };
        if (!ev.value) {
            result.status = CHECK_STATUS.FAILED;
            result.error = this.deviceExceptions.NO_VIDEO;
        }
        this.setResult(result);
    }

    setResult(result: CheckResult) {
        this.techCheckService.results.camera = result;
    }

    onPlayback() {
        if (!this.videoPlayer.nativeElement.onended) {
            this.videoPlayer.nativeElement.onended = () => {
                this.currentVideoStatus = VIDEO_STATUS.RECORD_READY;
            };
        }
        this.currentVideoStatus = VIDEO_STATUS.PLAYING;
        this.videoPlayer.nativeElement.play();
    }

    onPause() {
        this.currentVideoStatus = VIDEO_STATUS.RECORD_READY;
        this.videoPlayer.nativeElement.pause();
    }

    onDelete() {
        this.subscriptions.push(
            this.techCheckService.deleteVideoArchive(this.archiveId).subscribe(), // Send and forget
        );
        this.videoUrl = null;
        this.currentVideoStatus = VIDEO_STATUS.LOADING;
        this.startVideo();
    }

    getCameraList = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.deviceHandler(devices);
            this.isErrorState = false;
        } catch (err) {
            const result = {
                status: CHECK_STATUS.FAILED,
                error: err.name,
            };
            this.setResult(result);
            let snackBarError;
            if (err.name === this.deviceExceptions.NOT_FOUND) {
                snackBarError = 'Make sure you have a Camera connected';
            } else if (err.name === this.deviceExceptions.IN_USE || err.name === this.deviceExceptions.ABORT_ERROR) {
                snackBarError = 'Camera in use by another program';
            }
            if (snackBarError) {
                this.snackBar.open(snackBarError, 'Close', {
                    duration: 3000,
                });
            }
            this.isErrorState = true;
        }
    }

    get result() {
        return this.techCheckService.results.camera;
    }

    private setDefaultDevice(deviceId) {
        if (deviceId) {
            this.devicesHistoryService.setVideoDeviceId(StreamType.primary, deviceId);
        }
    }

    private unPublishVideo() {
        if (this.session && this.publisher) {
            this.session.unpublish(this.publisher);
            this.publisher = null;
            this.session.disconnect();
        }
    }

    private deviceHandler = (devices) => {
        const cameras = devices.filter(d => d.kind === 'videoinput' && !!d.deviceId);
        if (cameras.length) {
            this.cameras = cameras;
            this.selectedCamera = this.cameras[0].deviceId;
            this.setDefaultDevice(this.selectedCamera);
            if (!this.publisher) {
                setTimeout(() => this.startVideo(), 1000);
            } else {
                this.selectedCameraChanged(this.selectedCamera);
            }
        } else {
            const result = {
                status: CHECK_STATUS.FAILED,
                error: this.deviceExceptions.NOT_FOUND,
            };
            this.setResult(result);
        }
    }
}
