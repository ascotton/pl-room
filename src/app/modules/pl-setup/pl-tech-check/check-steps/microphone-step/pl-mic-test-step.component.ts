import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DevicesHistoryService } from '@root/src/app/common/media';
import { StreamType } from '@root/src/app/modules/room/conference/store';
import { Subscription } from 'rxjs';
import { PLMultiLanguageService } from '../../../pl-multi-lang.service';
import { CheckResult, CHECK_STATUS, DEVICE_EXCEPTIONS } from '../../pl-tech-check.model';
import { PLTechCheckService } from '../../pl-tech-check.service';
declare var OT: any;

@Component({
    selector: 'pl-mic-test-step',
    templateUrl: 'pl-mic-test-step.component.html',
    styleUrls: ['./pl-mic-test-step.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLMicTestStepComponent implements OnInit, OnDestroy {
    @Input() public stepNumber: number;
    currentLevel = 0;
    selectedMic;
    micList = [];
    hasMicPermission = true;
    initialized = false;
    isLoading = true;
    checkStatus = CHECK_STATUS;
    isErrorState = false;
    readonly deviceExceptions = DEVICE_EXCEPTIONS;
    private session;
    private publisher;
    private micMovingAvg;
    private subscriptions: Subscription[] = [];

    constructor(private techCheckService: PLTechCheckService,
                private zone: NgZone,
                private snackBar: MatSnackBar,
                private multiLangService: PLMultiLanguageService,
                private devicesHistoryService: DevicesHistoryService) {
        this.subscriptions.push(
            this.techCheckService.stepStarted$.subscribe((step) => {
                if (step === this.stepNumber) {
                    const permissionsResult = this.techCheckService.results.permissions.microphone;
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
                    this.isLoading = true;
                    setTimeout(() => {
                        if (this.initialized) {
                            this.startAudio();
                        } else {
                            this.getMicList();
                        }
                        this.initialized = true;
                    },         500);
                } else {
                    this.currentLevel = 0;
                    this.unPublisAudio();
                }
            }),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnInit() {

    }

    isMultiLangEnabled = () => this.multiLangService.isMultiLangEnabled;

    isCheckCompleted() {
        return this.techCheckService.isStepCompleted(this.stepNumber);
    }

    onAnswerChanged(ev: MatRadioChange) {
        const result: CheckResult = { status: CHECK_STATUS.SUCCEED };
        if (!ev.value) {
            result.status = CHECK_STATUS.FAILED;
            result.error = this.deviceExceptions.NO_AUDIO;
        }
        this.setResult(result);
    }

    startAudio() {
        if (typeof(OT) === 'undefined') {
            const result = {
                status: CHECK_STATUS.FAILED,
                error: 'Opentok script load error.',
            };
            this.setResult(result);
            this.isLoading = false;
            return;
        }
        if (!this.session) {
            this.session = this.techCheckService.getOpenTokSession();
        } else {
            this.session.disconnect();
        }
        const publisherOptions = {
            showControls: false,
            audioSource: this.selectedMic,
            publishAudio: true,
            publishVideo: false,
            videoSource: null,
        };
        this.session.connect(this.techCheckService.getOpenTokToken(), (err) => {
            if (err) {
                const result = {
                    status: CHECK_STATUS.FAILED,
                    error: err,
                };
                this.setResult(result);
                this.isLoading = false;
                return;
            }
            if (this.techCheckService.getCurrentStep() === this.stepNumber) {
                this.publisher = OT.initPublisher('ot-mic', publisherOptions, (error) => {
                    if (error) {
                        this.unPublisAudio();
                        this.isErrorState = true;
                        const result = {
                            error,
                            status: CHECK_STATUS.FAILED,
                        };
                        this.setResult(result);
                    }
                    this.isLoading = false;
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
                            this.isLoading = false;
                        });
                    },
                    accessDenied: () => {
                        this.unPublisAudio();
                        this.isErrorState = true;
                        const result = {
                            status: CHECK_STATUS.FAILED,
                            error: 'Microphone access denied',
                        };
                        this.setResult(result);
                        this.isLoading = false;
                    },
                    audioLevelUpdated: (event) => {
                        if (this.micMovingAvg === null || this.micMovingAvg === undefined 
                            || this.micMovingAvg <= event.audioLevel) {
                            this.micMovingAvg = event.audioLevel;
                        } else {
                            this.micMovingAvg = 0.7 * this.micMovingAvg + 0.3 * event.audioLevel;
                        }

                        // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
                        let logLevel = (Math.log(this.micMovingAvg) / Math.LN10) / 1.5 + 1;
                        logLevel = Math.min(Math.max(logLevel, 0), 1);

                        this.zone.run(() => this.currentLevel = logLevel * 100);

                    },
                });
            }
        });
    }

    selectedMicChanged(id) {
        if (this.publisher) {
            this.publisher.setAudioSource(id);
        }
        this.setDefaultDevice(id);
    }

    getMicList = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.deviceHandler(devices);
        } catch (err) {
            this.isErrorState = true;
            const result = {
                status: CHECK_STATUS.FAILED,
                error: err.name,
            };
            this.setResult(result);
            if (err.name === this.deviceExceptions.NOT_FOUND) {
                this.snackBar.open('Make sure you have a Microphone connected', 'Close', {
                    duration: 3000,
                });
            }
        }
    }

    get result() {
        return this.techCheckService.results.microphone;
    }

    private setDefaultDevice(deviceId) {
        if (deviceId) {
            this.devicesHistoryService.setAudioDeviceId(StreamType.primary, deviceId);
        }
    }

    private unPublisAudio() {
        if (this.session && this.publisher) {
            this.session.unpublish(this.publisher);
            this.publisher = null;
            this.session.disconnect();
        }
    }

    private setResult(result: CheckResult) {
        this.techCheckService.results.microphone = result;
    }

    private deviceHandler = (devices) => {
        const mics = devices.filter(d => d.kind === 'audioinput' && !!d.deviceId && d.deviceId !== 'communications');
        if (mics.length) {
            this.micList = mics;
            this.setDefaultDevice(this.selectedMic);
            if (!this.publisher) {
                this.selectedMic = this.micList[0].deviceId;
                this.startAudio();
            } else if (this.micList[0].deviceId !== this.selectedMic) {
                this.selectedMic = this.micList[0].deviceId;
                this.selectedMicChanged(this.selectedMic);
            }
            this.isErrorState = false;
        } else {
            this.isErrorState = true;
            const result = {
                status: CHECK_STATUS.FAILED,
                error: this.deviceExceptions.NOT_FOUND,
            };
            this.setResult(result);
        }
    }
}
