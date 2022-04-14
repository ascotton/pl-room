import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import NetworkTest from 'opentok-network-test-js';
import { PLUrlsService } from '@root/index';
import { CheckResult, CHECK_STATUS, FirebaseTestCredentials, TechCheckResults, Steps, OpenTokTestCredentials, ResultsEmailData } from './pl-tech-check.model';
import { environment } from '../../../../environments/environment';
import { QualityTestResults } from 'opentok-network-test-js/dist/NetworkTest/testQuality';
import { GuidService } from '@root/src/app/common/services/GuidService';
import { ConnectivityTestResults } from 'opentok-network-test-js/dist/NetworkTest/testConnectivity';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
declare var OT: any;
declare var SomApi: any;

const CHECK_URLS = {
    YOUTUBE_API: 'https://www.youtube.com/iframe_api',
    REMOTE_HQ: 'https://api.remotehq.com/auth-check',
};

const defaultStatus = {
    status: CHECK_STATUS.PENDING,
    error: '',
};
@Injectable()
export class PLTechCheckService {
    readonly NETWORK_TEST_LIMITS = {
        MIN_SPEED: 0.5,
        MAX_JITTER: 20,
        MIN_MOS: 1.7,
    };
    steps = Steps;
    resultId = '';
    private techCheckRestartSource = new Subject();
    techCheckRestart$ = this.techCheckRestartSource.asObservable();
    private stepStartedSource = new BehaviorSubject<number>(0);
    stepStarted$ = this.stepStartedSource.asObservable();
    isTechCheckStarted = false;
    results: TechCheckResults;
    isPreSavedResult = false;
    createdDate = new Date();
    salesForceId: string;
    private readonly NETWORK_TIMEOUT_SECONDS = 10;
    private readonly IP_INFO_TOKEN = '5879e9203d9da9';
    private firebaseCredentials: FirebaseTestCredentials;
    private otNetworkTest: NetworkTest;
    private currentStep = -1;
    private openTokCredentials: OpenTokTestCredentials;
    private referenceCode;
    private otSession;

    constructor(private http: HttpClient,
                private plUrls: PLUrlsService,
                private guidService: GuidService,
                private currentUser: CurrentUserModel) {
        this.initTechCheck();
    }

    /*
        TECH CHECK AND STEP HANDLING METHODS
    */
    initTechCheck() {
        this.deleteFirebaseApp();
        this.setInitialResult();
        this.getDeviceInfo();
        this.initSpeedTest();

    }

    restartTechCheck() {
        this.setResultId('');
        this.isPreSavedResult = false;
        this.initTechCheck();
        this.techCheckRestartSource.next();
    }

    validateCode(code) {
        const url = `${this.plUrls.urls.workplaceFE}/api/v1/techcheck/validate_code/`;
        return this.httpAuthGetRequest(`${url}?code=${code}`).pipe(
            map((_data: any) => {
                return true;
            }),
            catchError(_err => of(false)),
        );
    }

    isCheckCompleted(check: CheckResult) {
        return check.status === CHECK_STATUS.SUCCEED || check.status === CHECK_STATUS.FAILED;
    }

    isStepCompleted(step: Steps) {
        switch (step) {
                case this.steps.Permissions:
                    return this.isCheckCompleted(this.results.permissions.camera)
                        && this.isCheckCompleted(this.results.permissions.microphone)
                        && this.isCheckCompleted(this.results.permissions.network);
                case this.steps.AudioPlayback:
                    return this.isCheckCompleted(this.results.audioPlayback);
                case this.steps.Microphone:
                    return this.isCheckCompleted(this.results.microphone);
                case this.steps.InternetSpeed:
                    return this.isCheckCompleted(this.results.internetSpeed.internetSpeed.result)
                        && this.isCheckCompleted(this.results.internetSpeed.audio.result)
                        && this.isCheckCompleted(this.results.internetSpeed.video.result);
                case this.steps.Camera:
                    return this.isCheckCompleted(this.results.camera);
        }
        return false;
    }

    setStep(step) {
        this.currentStep = step;
        this.stepStartedSource.next(step);
    }

    getCurrentStep() {
        return this.currentStep;
    }

    startTechCheck(code: string) {
        this.referenceCode = code;
        this.isTechCheckStarted = true;
    }

    saveTechCheck(status = 'PASSED') {
        const params: any = {
            status,
            device_id: this.results.userInfo.deviceId,
            data: this.results,
            salesforce_id: this.salesForceId,
        };
        if (this.referenceCode) {
            params.code = this.referenceCode;
        }
        const url = `${this.plUrls.urls.workplaceFE}/api/v1/techcheck/`;
        return this.httpAuthPostRequest(url, params).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(_err => null),
        );
    }

    getTechCheckResult(resultId) {
        const url = `${this.plUrls.urls.workplaceFE}/api/v1/techcheck/`;
        return this.httpAuthGetRequest(`${url}${resultId}`).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(_err => of(null)),
        );
    }

    setSavedResult(data) {
        this.isPreSavedResult = true;
        this.resultId = data.uuid;
        this.results = data.data;
        this.createdDate = new Date(data.created);
    }

    sendResultsEmail(data: ResultsEmailData) {
        const params: any = {
            from_name: data.name,
            to: [data.email],
            cc: !data.cc ? [] : data.cc.split(','),
            email_to_support: !!data.sendToSupport,
        };
        if (data.comments) {
            params.comments = data.comments;
        }
        const url = `${this.plUrls.urls.workplaceFE}/api/v1/techcheck/${this.resultId}/send_email/`;
        return this.httpAuthPostRequest(url, params);
    }

    setResultId(resultId) {
        this.resultId = resultId;
        this.updateResultIdUrl();
    }

    /*
        NETWORK TEST HELPER METHODS
    */

    getIpAndLocation() {
        return this.http.jsonp(`https://ipinfo.io/json?callback=JSONP_CALLBACK&token=${this.IP_INFO_TOKEN}`, null)
            .pipe(
                catchError(_err => of({})),
            );
    }

    isCompatibleBrowser() {
        const userBrowser = this.results.userInfo.browser;
        const isFirefox = userBrowser.toLowerCase().indexOf('firefox') > -1;
        const isChromium = (/Chrome/.test(userBrowser) && /Google Inc/.test(navigator.vendor));
        // 2020-08-04: ipad currently has 5 touchpoints
        const isSafariIpad = /Apple/.test(navigator.vendor)
                            && !/iPhone/.test(userBrowser)
                            && navigator.maxTouchPoints > 4;
        return isFirefox || isChromium || isSafariIpad;
    }

    getNetworkCredentials() {
        const networkDetail = this.results.permissions.networkDetail;
        networkDetail.firebase.status = CHECK_STATUS.LOADING;
        networkDetail.opentok.result.status = CHECK_STATUS.LOADING;
        const firebaseSub = this.getFirebaseCredentials();
        const otSub = this.getTokboxSession();
        return forkJoin({
            firebase: firebaseSub,
            openTok: otSub,
        }).pipe(
            catchError((err) => {
                const result: CheckResult = { status: CHECK_STATUS.FAILED, error: err  };
                return of({ firebase: { ...result }, openTok: { ...result } });
            }),
        );
    }

    validateURLConnectivity(url: string): Observable<CheckResult> {
        const httpOptions = {
            withCredentials: false,
        };
        return this.http.get(url, httpOptions).pipe(
            map(() => ({ status: CHECK_STATUS.SUCCEED })),
            catchError((err) => {
                if (err.status !== 0) { // Connection succeed
                    return of({ status: CHECK_STATUS.SUCCEED });
                }
                return of({ status: CHECK_STATUS.FAILED, error: err.message });
            }),
        );
    }

    validateImageConnectivity(url: string): Observable<CheckResult> {
        return new Observable<CheckResult>((observer) => {
            const img = new Image();
            let timer;
            const errorHandler = (err) => {
                if (timer) {
                    clearTimeout(timer);
                }
                observer.next({ status: CHECK_STATUS.FAILED, error: err });
                observer.complete();
            };
            const successHandler = () => {
                if (timer) {
                    clearTimeout(timer);
                }
                observer.next({ status: CHECK_STATUS.SUCCEED });
                observer.complete();
            };
            timer = setTimeout(() => errorHandler('Operation timed out.'), this.NETWORK_TIMEOUT_SECONDS * 1000);

            img.onload = successHandler;
            img.onerror = errorHandler;
            img.src = url;
        });
    }

    validateFirebaseConnectivity(): Observable<CheckResult> {
        const fbPath = `${this.firebaseCredentials.firebase_baseurl}/techcheck/`;
        let timeoutHandler;
        return new Observable<CheckResult>((observer) => {
            try {
                firebase.initializeApp(this.firebaseCredentials.firebase_app_config);
                const fb = firebase.database().refFromURL(fbPath);
                const promise = firebase.auth().signInWithCustomToken(this.firebaseCredentials.firebase_auth_token);
                timeoutHandler = setTimeout(() => {
                    observer.next({ error: 'Operation timed out', status: CHECK_STATUS.FAILED });
                    observer.complete();
                },                          this.NETWORK_TIMEOUT_SECONDS * 1000);
                promise.then(() => {
                    const randomKey = Math.floor((Math.random() * 100000000000));
                    const ref = fb.child(String(randomKey));
                    ref.set('test', (err) => {
                        if (err) {
                            observer.next({ status: CHECK_STATUS.FAILED, error: err.message });
                        } else {
                            observer.next({ status: CHECK_STATUS.SUCCEED });
                        }
                        if (timeoutHandler) {
                            window.clearTimeout(timeoutHandler);
                        }
                        ref.onDisconnect();
                        observer.complete();
                    });

                })
                .catch((error) => {
                    if (timeoutHandler) {
                        window.clearTimeout(timeoutHandler);
                    }
                    observer.next({ error, status: CHECK_STATUS.FAILED });
                    observer.complete();
                });
            } catch (ex) {
                if (timeoutHandler) {
                    window.clearTimeout(timeoutHandler);
                }
                observer.next({ error: ex.message, status: CHECK_STATUS.FAILED });
                observer.complete();
            }
        });
    }

    validateOpentokConnectivity() {
        return new Observable<ConnectivityTestResults>((observer) => {
            this.otNetworkTest.testConnectivity().then((results) => {
                observer.next(results);
                observer.complete();
            });
        });
    }

    validateYoutubeConnectivity(): Observable<CheckResult> {
        return new Observable<CheckResult>((observer) => {
            const head = document.head;
            const script = document.createElement('script');
            const timeout = setTimeout(() => {
                observer.next({ status: CHECK_STATUS.FAILED, error: 'Script load timed out' });
                observer.complete();
            },                         this.NETWORK_TIMEOUT_SECONDS * 1000);
            script.type = 'text/javascript';
            script.src = CHECK_URLS.YOUTUBE_API;

            // Then bind the event to the callback function.
            script.onload = () => {
                window.clearTimeout(timeout);
                const yt = (<any>window).YT;
                if (yt === null || yt === undefined) {
                    observer.next({ status: CHECK_STATUS.FAILED, error: 'Unable to load Youtube API' });
                } else {
                    observer.next({ status: CHECK_STATUS.SUCCEED });
                }
                observer.complete();
            };

            // Fire the loading
            head.appendChild(script);
        });
    }

    async deleteFirebaseApp() {
        if (firebase.apps.length) {
            await firebase.app().delete();
        }
    }

    isVideoUrlBlocked() {
        const opentokUrl = this.results.permissions.urlCheck.find(u => u.name === 'opentok');
        const tokboxUrl = this.results.permissions.urlCheck.find(u => u.name === 'tokbox');
        return !opentokUrl || !tokboxUrl ||
            opentokUrl.status.status !== CHECK_STATUS.SUCCEED || tokboxUrl.status.status !== CHECK_STATUS.SUCCEED;
    }

    /*
        INTERNET SPEED TEST HELPER METHODS
    */
    startSpeedTest(progressHandler, completionHandler, errorHandler) {
        SomApi.onProgress = progressHandler;
        SomApi.onTestCompleted = completionHandler;
        SomApi.onError = errorHandler;
        SomApi.startTest();
    }

    /*
        OPENTOK/DEVICE HELPER METHODS
    */
    getOpenTokSession() {
        if (this.otSession) {
            return this.otSession;
        }
        return OT.initSession(
            this.openTokCredentials.apiKey,
            this.openTokCredentials.sessionId,
            { ipWhitelist: true },
        );
    }

    getOpenTokToken() {
        return this.openTokCredentials.token;
    }

    startVideoRecording() {
        const params = {
            session_id: this.openTokCredentials.sessionId,
            uid: '',
        };
        const url = `${this.plUrls.urls.platformFE}/api/v1/techcheck/start_video_recording/`;
        return this.httpAuthPostRequest(url, params).pipe(
            map((data: any) => {
                return data.archive_id;
            }),
            catchError(err => ''),
        );
    }

    stopRecording(archiveId) {
        const params = {
            archive_id: archiveId,
            uid: '',
        };
        const url = `${this.plUrls.urls.platformFE}/api/v1/techcheck/stop_video_recording/`;
        return this.httpAuthPostRequest(url, params).pipe(
            map((data: any) => {
                return of(true);
            }),
            catchError(err => of(false)),
        );
    }

    getVideoArchive(archiveId): Observable<string> {
        const url = `${this.plUrls.urls.platformFE}/api/v1/techcheck/get_video_archive/?archive_id=${archiveId}`;
        return this.httpAuthGetRequest(url).pipe(
            mergeMap((data: any) => {
                if (data.status === 'uploaded') {
                    return of(data.url);
                }
                return this.getVideoArchive(archiveId);
            }),
            catchError(err => of('')),
        );
    }

    deleteVideoArchive(archiveId) {
        const params = {
            archive_id: archiveId,
        };
        const url = `${this.plUrls.urls.platformFE}/api/v1/techcheck/delete_video_archive/`;
        return this.httpAuthPostRequest(url, params).pipe(
            map(_data => of(true)),
            catchError(_err => of(false)),
        );
    }

    getVideoUrl(archiveId) {
        return `${this.plUrls.urls.platformFE}/api/v1/techcheck/view_video_archive/?archive_id=${archiveId}`;
    }

    runOTQualityTest(progressCallback) {
        return new Observable<{ result: CheckResult, detail?: QualityTestResults }>((observer) => {
            if (this.results.permissions.networkDetail.opentok.result.status === CHECK_STATUS.SUCCEED) {
                this.otNetworkTest.testQuality(progressCallback).then(
                (results) => {
                    observer.next({ result: { status: CHECK_STATUS.SUCCEED }, detail: results });
                },
                (error) => {
                    observer.next({ result: { error, status: CHECK_STATUS.FAILED } });
                });
            } else {
                observer.next({ result: { status: CHECK_STATUS.FAILED } });
            }
        });
    }

    /*
        PRIVATE METHODS
    */

    private getAuthHeaders() {
        let headers = new HttpHeaders();
        if (!!this.currentUser && !!this.currentUser.jwt) {
            headers = headers.set('Authorization', `JWT ${this.currentUser.jwt}`);
        }
        return headers;
    }

    private httpAuthGetRequest(url: string) {
        const headers = this.getAuthHeaders();
        return this.http.get(url, { headers });
    }

    private httpAuthPostRequest(url: string, params) {
        const headers = this.getAuthHeaders();
        return this.http.post(url, params, { headers });
    }

    private getDeviceInfo() {
        const deviceIDKey = 'techcheckDeviceId';
        const storedDeviceID = localStorage.getItem(deviceIDKey);
        if (!storedDeviceID) {
            this.results.userInfo.deviceId = this.guidService.generateUUID();
            localStorage.setItem(deviceIDKey, this.results.userInfo.deviceId);
        } else {
            this.results.userInfo.deviceId = storedDeviceID;
        }
        this.results.userInfo.browser = navigator.userAgent;
        this.results.userInfo.os = this.getUserOS();
        this.results.userInfo.screenResolution = {
            width: window.screen.width * window.devicePixelRatio,
            height: window.screen.height * window.devicePixelRatio,
        };
        this.results.userInfo.windowSize = {
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
        };
        this.results.userInfo.devicePixelRatio = window.devicePixelRatio;
    }

    private getUserOS() {
        let osName = 'Unknown';
        if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) osName = 'Windows 10';
        if (window.navigator.userAgent.indexOf('Windows NT 6.2')  !== -1) osName = 'Windows 8';
        if (window.navigator.userAgent.indexOf('Windows NT 6.1')  !== -1) osName = 'Windows 7';
        if (window.navigator.userAgent.indexOf('Windows NT 6.0')  !== -1) osName = 'Windows Vista';
        if (window.navigator.userAgent.indexOf('Windows NT 5.1')  !== -1) osName = 'Windows XP';
        if (window.navigator.userAgent.indexOf('Windows NT 5.0')  !== -1) osName = 'Windows 2000';
        if (window.navigator.userAgent.indexOf('Mac')             !== -1) osName = 'Mac/iOS';
        if (window.navigator.userAgent.indexOf('X11')             !== -1) osName = 'UNIX';
        if (window.navigator.userAgent.indexOf('Linux')           !== -1) osName = 'Linux';
        return osName;
    }

    private initSpeedTest() {
        if (typeof(SomApi) === 'undefined' || SomApi === null) {
            this.results.internetSpeed.internetSpeed.result.status = CHECK_STATUS.FAILED;
            this.results.internetSpeed.internetSpeed.result.error = 'Couldn\'t load speedtest API script.';
            return;
        }
        SomApi.account = environment.speed_of_me.key;
        SomApi.domainName = window.location.hostname;
        SomApi.config.progress.enabled = true;
        SomApi.config.progress.verbose = true;
        SomApi.config.latencyTestEnabled = true;
        SomApi.config.testServerEnabled = true;
    }

    private getFirebaseCredentials(): Observable<CheckResult> {
        const url = `${this.plUrls.urls.platformFE}/api/v1/techcheck/rtdb_credentials/`;

        return this.httpAuthGetRequest(url).pipe(
            map((data: FirebaseTestCredentials) => {
                this.firebaseCredentials = data;
                return { status: CHECK_STATUS.SUCCEED };
            }),
            catchError(err => of({ status: CHECK_STATUS.FAILED, error: err.message })),
        );
    }

    private getTokboxSession(): Observable<CheckResult> {
        // https://techcheck.presencelearning.com/api/v1/techcheck/start_video_test/
        const url = `${this.plUrls.urls.platformFE}/api/v1/techcheck/start_video_test/`;
        return this.httpAuthPostRequest(url, {}).pipe(
            map((data: any) => {
                this.openTokCredentials = {
                    apiKey: data.api_key,
                    sessionId: data.session_id,
                    token: data.token,
                };
                this.otNetworkTest = new NetworkTest(OT, this.openTokCredentials);

                return { status: CHECK_STATUS.SUCCEED };
            }),
            catchError(err => of({ status: CHECK_STATUS.FAILED, error: err.message })),
        );
    }

    private updateResultIdUrl() {
        // Set the current URL to have the new result id param
        // May need to change it to use Angular State Management when move to Ng2 Router
        const queryParams = new URLSearchParams(window.location.search);
        if (this.resultId) {
            queryParams.set('resultid', this.resultId);
        } else {
            queryParams.delete('resultid');
        }
        const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
        history.replaceState(null, '', newUrl);
    }

    private setInitialResult() {
        this.results = {
            userInfo: {
                deviceId: '',
                os: '',
                browser: '',
                locationDetails: {
                    city: '',
                    country: '',
                    hostname: '',
                    ip: '',
                    loc: '',
                    org: '',
                    postal: '',
                    region: '',
                    timezone: '',
                },
            },
            permissions: {
                camera: { ...defaultStatus },
                microphone: { ...defaultStatus },
                network: { ...defaultStatus },
                networkDetail: {
                    youtube: { ...defaultStatus },
                    opentok: {
                        result: {...defaultStatus },
                    },
                    firebase: { ...defaultStatus },
                },
                urlCheck: [],
            },
            audioPlayback: { ...defaultStatus },
            microphone: { ...defaultStatus },
            camera: { ...defaultStatus },
            internetSpeed: {
                internetSpeed: {
                    result: { ...defaultStatus },
                    downloadSpeed: 0,
                    uploadSpeed: 0,
                    jitter: 0,
                },
                audio: {
                    result: { ...defaultStatus },
                    detail: null,
                },
                video: {
                    result: { ...defaultStatus },
                    detail: null,
                },
            },
        };
    }
}
