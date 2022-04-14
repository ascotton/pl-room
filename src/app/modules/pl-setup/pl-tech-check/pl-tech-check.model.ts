import { ConnectivityTestResults } from 'opentok-network-test-js/dist/NetworkTest/testConnectivity';
import { AverageStats } from 'opentok-network-test-js/dist/NetworkTest/testQuality/types/stats';

export enum Steps {
    Permissions,
    AudioPlayback,
    Microphone,
    Camera,
    InternetSpeed,
    Results,
}
export const CHECK_STATUS = {
    PENDING: 'pending',
    LOADING: 'loading',
    SUCCEED: 'succeed',
    FAILED: 'failed',
};

export const DEVICE_EXCEPTIONS = {
    NOT_FOUND: 'NotFoundError',
    IN_USE: 'NotReadableError',
    NO_PERMISSIONS: 'NotAllowedError',
    OPENTOK_ERROR: 'OpentokConnectivityError',
    NO_VIDEO: 'NoVideoError',
    NO_AUDIO: 'NoAudioError',
    NO_SYSTEM_PERMISSIONS: 'SystemNotAllowedError',
    ABORT_ERROR: 'AbortError',
};
export interface CheckResult {
    status: string;
    error?: string;
}
export interface OpenTokConnectivityTestResult {
    result: CheckResult;
    detail?: ConnectivityTestResults;
}
export interface NetworkCheckDetail {
    youtube: CheckResult;
    firebase: CheckResult;
    opentok: OpenTokConnectivityTestResult;
}

export interface LocationDetails {
    city: string;
    country: string;
    hostname: string;
    ip: string;
    loc: string;
    org: string;
    postal: string;
    region: string;
    timezone: string;
}
export interface ScreenResolution {
    width: number;
    height: number;
}
export interface UserInfo {
    deviceId: string;
    browser: string;
    os: string;
    locationDetails: LocationDetails;
    screenResolution?: ScreenResolution;
    windowSize?: ScreenResolution;
    devicePixelRatio?: number;
}
export interface PermissionsResult {
    camera: CheckResult;
    microphone: CheckResult;
    network: CheckResult;
    networkDetail: NetworkCheckDetail;
    urlCheck: URLCheck[];
}
export interface InternetSpeedResult {
    internetSpeed: {
        result: CheckResult;
        downloadSpeed: number;
        uploadSpeed: number;
        jitter: number;
        latency?: number;
    };
    audio: {
        result: CheckResult;
        detail: AverageStats
    };
    video: {
        result: CheckResult;
        detail: AverageStats;
    };
}
export interface TechCheckResults {
    userInfo: UserInfo;
    permissions: PermissionsResult;
    audioPlayback: CheckResult;
    microphone: CheckResult;
    camera: CheckResult;
    internetSpeed: InternetSpeedResult;
}

interface FirebaseAppConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket: string;
    messagingSenderId: string;
}

export interface FirebaseTestCredentials {
    firebase_app_config: FirebaseAppConfig;
    firebase_auth_token: string;
    firebase_baseurl: string;
}

export interface OpenTokTestCredentials {
    apiKey: string;
    sessionId: string;
    token: string;
}

export interface URLCheck {
    name: string;
    status: CheckResult;
    url: string;
    label: string;
    isCritical: boolean;
    group?: string;
    isImageTest?: boolean;
}

export interface ResultsEmailData {
    name: string;
    email: string;
    cc?: string;
    comments?: string;
    sendToSupport?: boolean;
}
