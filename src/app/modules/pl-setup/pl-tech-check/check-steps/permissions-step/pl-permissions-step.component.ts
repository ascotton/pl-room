import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { PLTechCheckService } from '../../pl-tech-check.service';
import { CHECK_STATUS, DEVICE_EXCEPTIONS } from '../../pl-tech-check.model';
import { forkJoin, Subscription } from 'rxjs';
import plCheckUrlsConstant from './pl-check-urls.constant';
import { PLMultiLanguageService } from '../../../pl-multi-lang.service';
import { ConnectivityTestResults } from 'opentok-network-test-js/dist/NetworkTest/testConnectivity';

declare var liveagent: any;
@Component({
    selector: 'pl-permissions-step',
    templateUrl: 'pl-permissions-step.component.html',
    styleUrls: ['./pl-permissions-step.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLPermissionsStepComponent implements OnInit, OnDestroy {
    @Input() public stepNumber: number;
    PERMISSION_STATUS = CHECK_STATUS;
    private urlChecks = plCheckUrlsConstant;
    private subscriptions: Subscription[] = [];

    constructor(private techCheckService: PLTechCheckService, private multiLangService: PLMultiLanguageService) {
    }

    ngOnDestroy() {
        this.destroySubscriptions();
    }

    ngOnInit() {

    }

    isMultiLangEnabled = () => this.multiLangService.isMultiLangEnabled;

    async onRequestPermissions() {
        this.results.camera.status = CHECK_STATUS.LOADING;
        this.results.microphone.status = CHECK_STATUS.LOADING;
        this.results.network.status = CHECK_STATUS.LOADING;
        this.destroySubscriptions();
        this.results.urlCheck = [];
        await this.doRequestPermissions();
    }

    get results() {
        return this.techCheckService.results.permissions;
    }

    get checksCompleted() {
        return this.techCheckService.isStepCompleted(this.stepNumber);
    }

    get isLoading() {
        return this.results.camera.status === CHECK_STATUS.LOADING
            || this.results.microphone.status === CHECK_STATUS.LOADING
            || this.results.network.status === CHECK_STATUS.LOADING;
    }

    private doNetworkCheck() {
        const postSubs: any = {};
        this.subscriptions.push(
            this.techCheckService.getNetworkCredentials().subscribe((res) => {
                if (res.openTok.status === CHECK_STATUS.FAILED) {
                    this.results.networkDetail.opentok.result = res.openTok;
                } else {
                    this.results.networkDetail.opentok.result.status = CHECK_STATUS.LOADING;
                    postSubs.openTok = this.techCheckService.validateOpentokConnectivity();
                }
                if (res.firebase.status === CHECK_STATUS.FAILED) {
                    this.results.networkDetail.firebase = res.firebase;
                } else {
                    this.results.networkDetail.firebase.status = CHECK_STATUS.LOADING;
                    postSubs.firebase = this.techCheckService.validateFirebaseConnectivity();
                }
                this.results.networkDetail.youtube.status = CHECK_STATUS.LOADING;
                postSubs.youtube = this.techCheckService.validateYoutubeConnectivity();
                postSubs.ipAndLocation = this.techCheckService.getIpAndLocation();
                const urlChecks = this.urlChecks;
                urlChecks.forEach((u) => {
                    postSubs['url_' + u.name] = u.isImageTest ?
                        this.techCheckService.validateImageConnectivity(u.url) :
                        this.techCheckService.validateURLConnectivity(u.url);
                });
                this.subscriptions.push(
                    forkJoin(postSubs).subscribe((postRes: any) => {
                        this.techCheckService.results.userInfo.locationDetails = postRes.ipAndLocation;
                        if (postRes.openTok) {
                            const result = (postRes.openTok as ConnectivityTestResults);
                            this.results.networkDetail.opentok = {
                                result: { status: result.success ? CHECK_STATUS.SUCCEED : CHECK_STATUS.FAILED },
                                detail: result,
                            }
                        }
                        if (postRes.firebase) {
                            this.results.networkDetail.firebase = postRes.firebase;
                            this.results.urlCheck.push({
                                name: 'firebaseio',
                                status: postRes.firebase,
                                url: 'https://firebaseio.com/',
                                label: '*.firebaseio.com',
                                isCritical: true,
                            });
                        }
                        this.results.networkDetail.youtube = postRes.youtube;
                        // Add youtube.com result
                        this.results.urlCheck.push({
                            name: 'youtube',
                            status: postRes.youtube,
                            url: 'https://youtube.com',
                            label: '*.youtube.com',
                            isCritical: false,
                            group: 'youtube',
                        });
                        // If liveagent global var is not undefined, salesforceliveagent.com connection has succeed
                        this.results.urlCheck.push({
                            name: 'salesforce',
                            status: { status: typeof(liveagent) === 'undefined'
                                    ? CHECK_STATUS.FAILED : CHECK_STATUS.SUCCEED },
                            url: 'https://salesforceliveagent.com',
                            label: '*.salesforceliveagent.com',
                            isCritical: true,
                        });
                        urlChecks.forEach((url) => {
                            url.status = postRes['url_' + url.name];
                            this.results.urlCheck.push(url);
                        });
                        this.results.network.status = CHECK_STATUS.SUCCEED;
                    }),
                );
            }),
        );
    }

    private async doRequestPermissions() {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            audioStream.getTracks().forEach(track => track.stop());
            this.results.microphone.status = CHECK_STATUS.SUCCEED;
        } catch (err) {
            let error = err.name;
            if (err.message.toLowerCase().indexOf('system') > -1) {
                error = DEVICE_EXCEPTIONS.NO_SYSTEM_PERMISSIONS;
            }
            this.results.microphone = { error, status: CHECK_STATUS.FAILED };
        }
        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            videoStream.getTracks().forEach(track => track.stop());
            this.results.camera.status = CHECK_STATUS.SUCCEED;
        } catch (err) {
            let error = err.name;
            if (err.message.toLowerCase().indexOf('system') > -1) {
                error = DEVICE_EXCEPTIONS.NO_SYSTEM_PERMISSIONS;
            }
            this.results.camera = { error, status: CHECK_STATUS.FAILED };
        }
        try {
            await this.techCheckService.deleteFirebaseApp();
        } catch (error) {
            this.results.networkDetail.firebase = { status: CHECK_STATUS.FAILED, error: error.message };
        }
        this.doNetworkCheck();
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
