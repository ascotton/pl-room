import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PLMultiLanguageService } from '../../../pl-multi-lang.service';
import { CHECK_STATUS, Steps } from '../../pl-tech-check.model';
import { PLTechCheckService } from '../../pl-tech-check.service';

const TEST_TYPES = {
    DOWNLOAD: 'download',
    UPLOAD: 'upload',
};

@Component({
    selector: 'pl-internet-speed-step',
    templateUrl: 'pl-internet-speed-step.component.html',
    styleUrls: ['./pl-internet-speed-step.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('showHide', [
            state('visible', style({
                height: '*',
                opacity: '1',
                display: '*',
            })),
            state('hidden', style({
                height: '0px',
                opacity: '0',
                display: 'none',
            })),
            transition('visible => hidden', [
                animate('0.5s'),
            ]),
            transition('hidden => visible', [
                animate('0.5s'),
            ]),
        ]),
    ],
})
export class PLInternetSpeedStepComponent implements OnInit, OnDestroy {
    @Input() public stepNumber: number;
    currentValues = {
        internetSpeed: 0,
        audio: 0,
        video: 0,
    };
    currentTest = TEST_TYPES.DOWNLOAD;
    isScriptFail = false;
    checkStarted = false;
    readonly checkStatus = CHECK_STATUS;
    private resultCount = {
        audio: 0,
        video: 0,
    };
    private prevBitsReceived = {
        audio: 0,
        video: 0,
    };
    private subscriptions: Subscription[] = [];
    private timeoutHandler;

    constructor(private techCheckService: PLTechCheckService,
                private zone: NgZone,
                private multiLangService: PLMultiLanguageService) {

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnInit() {

    }

    isMultiLangEnabled = () => this.multiLangService.isMultiLangEnabled;

    onStartTest() {
        if (this.techCheckService.results.internetSpeed.internetSpeed.result.status !== CHECK_STATUS.FAILED) {
            this.startSpeedTest();
        } else {
            this.runQualityTest();
        }
        this.checkStarted = true;
    }

    onTestAgain() {
        this.currentTest = TEST_TYPES.DOWNLOAD;
        this.startSpeedTest();
    }

    private startSpeedTest() {
        this.results.internetSpeed.result = {
            status: CHECK_STATUS.LOADING,
            error: null,
        };
        this.timeoutHandler = setTimeout(() => {
            if (!this.currentValues.internetSpeed) {
                this.onSpeedTestError('Operation timed out.');
            }
        },                               10000);
        this.techCheckService
        .startSpeedTest(this.onSpeedTestProgress, this.onSpeedTestCompleted, this.onSpeedTestError);
    }

    isStepCompleted() {
        return this.techCheckService.isStepCompleted(Steps.InternetSpeed);
    }

    isCheckCompleted(check) {
        return !this.techCheckService.isCheckCompleted(check);
    }

    get results() {
        return this.techCheckService.results.internetSpeed;
    }

    get networkLimits() {
        return this.techCheckService.NETWORK_TEST_LIMITS;
    }

    private runQualityTest() {
        this.results.audio.result.status = CHECK_STATUS.LOADING;
        this.results.video.result.status = CHECK_STATUS.LOADING;

        this.subscriptions.push(
            this.techCheckService.runOTQualityTest(this.qualityProgress)
            .subscribe((res) => {
                if (res.result.status === CHECK_STATUS.SUCCEED) {
                    const videoMOS = res.detail.video.mos;
                    const audiomOS = res.detail.audio.mos;
                    const videoStatus = !videoMOS || videoMOS < this.techCheckService.NETWORK_TEST_LIMITS.MIN_MOS ?
                                        CHECK_STATUS.FAILED : CHECK_STATUS.SUCCEED;
                    const audioStatus = !audiomOS || audiomOS < this.techCheckService.NETWORK_TEST_LIMITS.MIN_MOS ?
                                        CHECK_STATUS.FAILED : CHECK_STATUS.SUCCEED;
                    this.results.audio = {
                        result: {
                            status: audioStatus,
                        },
                        detail: res.detail.audio,
                    };
                    this.results.video = {
                        result: {
                            status: videoStatus,
                        },
                        detail: res.detail.video,
                    };
                } else {
                    this.results.audio.result = res.result;
                    this.results.video.result = res.result;
                }
            }),
        );
    }

    private qualityProgress = (stats) => {
        this.setCurrentBitrate('audio', stats);
        this.setCurrentBitrate('video', stats);
    }

    private setCurrentBitrate = (mediaType, stats) => {
        const mediaStats = stats[mediaType];
        const bitsReceived = mediaStats && mediaStats.bytesReceived ? mediaStats.bytesReceived * 8 : 0;
        this.resultCount[mediaType]++;
        this.zone.run(() =>  this.currentValues[mediaType] = bitsReceived - this.prevBitsReceived[mediaType]);
        this.prevBitsReceived[mediaType] = bitsReceived;
    }


    private onSpeedTestProgress = (progress) => {
        if (progress.type === 'upload') {
            this.currentTest = TEST_TYPES.UPLOAD;
            this.zone.run(() => this.currentValues.internetSpeed = progress.currentSpeed);
        } else if (progress.type === 'download') {
            this.currentTest = TEST_TYPES.DOWNLOAD;
            this.zone.run(() => this.currentValues.internetSpeed = progress.currentSpeed);
        }
    }

    private onSpeedTestCompleted = (result: any) => {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
        let status = CHECK_STATUS.SUCCEED;
        if (result.upload < this.techCheckService.NETWORK_TEST_LIMITS.MIN_SPEED
            || result.download < this.techCheckService.NETWORK_TEST_LIMITS.MIN_SPEED) {
            status = CHECK_STATUS.FAILED;
        }
        this.results.internetSpeed = {
            result: {
                status,
            },
            uploadSpeed: result.upload,
            downloadSpeed: result.download,
            jitter: result.jitter,
            latency: result.latency,
        };
        this.runQualityTest();
    }

    private onSpeedTestError = (error: any) => {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
        this.results.internetSpeed = {
            result: {
                status: CHECK_STATUS.FAILED,
                error: error.message,
            },
            uploadSpeed: 0,
            downloadSpeed: 0,
            jitter: 0,
            latency: 0,
        };
        this.runQualityTest();
    }
}
