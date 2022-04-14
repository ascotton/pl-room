// This was grabbed from the @opentok/client (v2.19.4) package
// node_modules/@opentok/client/dist/js/opentok.d.ts

declare namespace OT {
  export type OTError = {
    name: string;
    message: string;
  };

  export type Dimensions = {
    width: number;
    height: number;
  }

  export type ScreenSharingCapabilityResponse = {
    extensionInstalled?: boolean;
    supported: boolean;
    supportedSources: {
      application?: boolean;
      screen?: boolean;
      window?: boolean;
    };
    extensionRequired?: string;
    extensionRegistered?: boolean;
  };

  export function checkScreenSharingCapability(
    callback: (response: ScreenSharingCapabilityResponse) => void
  ): void;

  export function checkSystemRequirements(): number;

  export type Device = {
    kind: 'audioInput' | 'videoInput';
    deviceId: string;
    label: string;
  };

  export function getDevices(
    callback: (error: OTError | undefined, devices?: Device[]) => void
  ): void;

  export function setProxyUrl(proxyUrl: string): void;

  export function getSupportedCodecs(): Promise<{ videoEncoders: ('H264' | 'VP8')[], videoDecoders: ('H264' | 'VP8')[] }>;

  export type WidgetStyle = {
    audioLevelDisplayMode: 'auto' | 'on' | 'off';
    backgroundImageURI: string;
    buttonDisplayMode: 'auto' | 'on' | 'off';
    nameDisplayMode: 'auto' | 'on' | 'off';
  };

  export type WidgetProperties = {
    fitMode?: 'cover' | 'contain';
    insertDefaultUI?: boolean;
    insertMode?: 'replace' | 'after' | 'before' | 'append';
    showControls?: boolean;
    width?: string | number;
    height?: string | number;
  };

  export type PublisherStyle = WidgetStyle & {
    archiveStatusDisplayMode: 'auto' | 'off';
  };

  export type GetUserMediaProperties = {
    audioSource?: string | null | boolean | MediaStreamTrack;
    disableAudioProcessing?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    autoGainControl?: boolean;
    facingMode?: 'user' | 'environment' | 'left' | 'right';
    frameRate?: 30 | 15 | 7 | 1;
    maxResolution?: Dimensions;
    resolution?: (
      '1280x960' |
      '1280x720' |
      '640x480' |
      '640x360' |
      '320x240' |
      '320x180'
    );
    videoSource?: string | null | boolean | MediaStreamTrack;
  };

  export type PublisherProperties = WidgetProperties & GetUserMediaProperties & {
    audioBitrate?: number;
    audioFallbackEnabled?: boolean;
    mirror?: boolean;
    name?: string;
    publishAudio?: boolean;
    publishVideo?: boolean;
    style?: Partial<PublisherStyle>;
  };

  export type SubscriberStyle = WidgetStyle & {
    videoDisabledDisplayMode: 'auto' | 'on' | 'off';
    audioBlockedDisplayMode: 'auto' | 'on' | 'off';
  };

  export type SubscriberProperties = WidgetProperties & {
    audioVolume?: number;
    preferredFrameRate?: number;
    preferredResolution?: Dimensions;
    style?: Partial<SubscriberStyle>;
    subscribeToAudio?: boolean;
    subscribeToVideo?: boolean;
    testNetwork?: boolean;
  };

  export class Connection {
    connectionId: string;
    creationTime: number;
    data: string;
  }

  export class Stream {
    connection: Connection;
    creationTime: number;
    frameRate: number;
    hasAudio: boolean;
    hasVideo: boolean;
    name: string;
    streamId: string;
    videoDimensions: {
      width: number;
      height: number;
    };
    videoType: 'camera' | 'screen';
  }

  export type Event<Type, Target> = {
    type: Type;
    cancelable: boolean;
    target: Target;

    isDefaultPrevented(): boolean;
    preventDefault(): void;
  };

  export type ExceptionEvent = Event<'exception', {}> & {
    code: number;
    message: string;
    title: string;
  };

  export type VideoDimensionsChangedEvent<Target> = Event<'videoDimensionsChanged', Target> & {
    oldValue: Dimensions;
    newValue: Dimensions;
  };

  class OTEventEmitter<EventMap> {
    on<EventName extends keyof EventMap>(
      eventName: EventName,
      callback: (event: EventMap[EventName]) => void,
      context?: object
    ): void;

    on(
      eventName: string,
      callback: (event: Event<string, any>) => void,
      context?: object
    ): void;

    on(
      eventMap: object,
      context?: object
    ): void;

    once<EventName extends keyof EventMap>(
      eventName: EventName,
      callback: (event: EventMap[EventName]) => void,
      context?: object
    ): void;

    once(
      eventName: string,
      callback: (event: Event<string, any>) => void,
      context?: object
    ): void;

    once(
      eventMap: object,
      context?: object
    ): void;

    off<EventName extends keyof EventMap>(
      eventName?: EventName,
      callback?: (event: EventMap[EventName]) => void,
      context?: object
    ): void;

    off(
      eventName?: string,
      callback?: (event: Event<string, any>) => void,
      context?: object
    ): void;

    off(
      eventMap: object,
      context?: object
    ): void;
  }

  export class Publisher extends OTEventEmitter<{
    accessAllowed: Event<'accessAllowed', Publisher>;
    accessDenied: Event<'accessDenied', Publisher>;
    accessDialogClosed: Event<'accessDialogClosed', Publisher>;
    accessDialogOpened: Event<'accessDialogOpened', Publisher>;

    audioLevelUpdated: Event<'audioLevelUpdated', Publisher> & {
      audioLevel: number
    };

    destroyed: Event<'destroyed', Publisher>;

    mediaStopped: Event<'mediaStopped', Publisher> & {
      track: MediaStreamTrack | undefined
    };

    streamCreated: Event<'streamCreated', Publisher> & {
      stream: Stream;
    };

    streamDestroyed: Event<'streamDestroyed', Publisher> & {
      stream: Stream;
      reason: string;
    };

    videoDimensionsChanged: VideoDimensionsChangedEvent<Publisher>;

    videoElementCreated: Event<'videoElementCreated', Publisher> & {
      element: HTMLVideoElement | HTMLObjectElement;
    };
  }> {
    accessAllowed: boolean;
    element?: HTMLElement | undefined;
    id?: string;
    stream?: Stream;
    streamId?: string;
    session?: Session;

    destroy(): void;
    getImgData(): string | null;
    getStats(callback: (error?: OTError, stats?: PublisherStatsArr) => void): void;
    getRtcStatsReport(): Promise<PublisherRtcStatsReportArr>;
    getStyle(): PublisherProperties;
    publishAudio(value: boolean): void;
    publishVideo(value: boolean): void;
    cycleVideo(): Promise<{ deviceId: string }>;
    setAudioSource(audioSource: string | MediaStreamTrack): Promise<undefined>;
    getAudioSource(): MediaStreamTrack;
    setVideoSource(videoSourceId: string): Promise<undefined>;
    getVideoSource(): { deviceId: string | null, type: string | null, track: MediaStreamTrack | null };
    setStyle<Style extends keyof PublisherStyle>(style: Style, value: PublisherStyle[Style]): void;
    videoWidth(): number | undefined;
    videoHeight(): number | undefined;
  }

  export function getUserMedia(
    properties?: GetUserMediaProperties
  ): Promise<MediaStream>;

  export function initPublisher(
    targetElement?: HTMLElement | string,
    properties?: PublisherProperties,
    callback?: (error?: OTError) => void
  ): Publisher;

  export function log(message: string): void;

  export function off(
    eventName?: 'exception',
    callback?: (event: ExceptionEvent) => void,
    context?: object
  ): void;

  export function on(
    eventName: 'exception',
    callback: (event: ExceptionEvent) => void,
    context?: object
  ): void;

  export function once(
    eventName: 'exception',
    callback: (event: ExceptionEvent) => void,
    context?: object
  ): void;

  export class Session extends OTEventEmitter<{
    archiveStarted: Event<'archiveStarted', Session> & {
      id: string;
      name: string;
    };

    archiveStopped: Event<'archiveStopped', Session> & {
      id: string;
      name: string;
    };

    connectionCreated: Event<'connectionCreated', Session> & {
      connection: Connection;
    };

    connectionDestroyed: Event<'connectionDestroyed', Session> & {
      connection: Connection;
      reason: string;
    };

    sessionConnected: Event<'sessionConnected', Session>;

    sessionDisconnected: Event<'sessionDisconnected', Session> & {
      reason: string;
    };

    sessionReconnected: Event<'sessionReconnected', Session>;
    sessionReconnecting: Event<'sessionReconnecting', Session>;

    signal: Event<'signal', Session> & {
      type?: string;
      data?: string;
      from: Connection;
    };

    streamCreated: Event<'streamCreated', Session> & {
      stream: Stream;
    };

    streamDestroyed: Event<'streamDestroyed', Session> & {
      stream: Stream;
      reason: string;
    };

    streamPropertyChanged: (
      Event<'streamPropertyChanged', Session> & {
        stream: Stream;
      } & (
        { changedProperty: 'hasAudio'; oldValue: boolean; newValue: boolean; } |
        { changedProperty: 'hasVideo'; oldValue: boolean; newValue: boolean; } |
        { changedProperty: 'videoDimensions'; oldValue: Dimensions; newValue: Dimensions; }
      )
    );
  }> {
    capabilities: {
      forceDisconnect: number;
      forceUnpublish: number;
      publish: number;
      subscribe: number;
    };

    connection?: Connection;
    sessionId: string;

    connect(token: string, callback: (error?: OTError) => void): void;
    disconnect(): void;
    forceDisconnect(connection: Connection, callback: (error?: OTError) => void): void;
    forceUnpublish(stream: Stream, callback: (error?: OTError) => void): void;
    getPublisherForStream(stream: Stream): Publisher | undefined;
    getSubscribersForStream(stream: Stream): [Subscriber];
    publish(publisher: Publisher, callback?: (error?: OTError) => void): Publisher;
    publish(targetElement: string | HTMLElement, properties?: PublisherProperties, callback?: (error?: OTError) => void): Publisher;

    signal(
      signal: { type?: string, data?: string, to?: Connection },
      callback: (error?: OTError) => void
    ): void;

    subscribe(
      stream: Stream,
      targetElement?: HTMLElement | string,
      properties?: SubscriberProperties,
      callback?: (error?: OTError) => void
    ): Subscriber;

    unpublish(publisher: Publisher): void;
    unsubscribe(subscriber: Subscriber): void;
  }

  export function initSession(
    partnerId: string,
    sessionId: string,
    options?: {
      connectionEventsSuppressed?: boolean;
      iceConfig?: {
        includeServers: 'all' | 'custom';
        transportPolicy: 'all' | 'relay';
        customServers: {
          urls: string | string[];
          username?: string;
          credential?: string;
        }[];
      };
      ipWhitelist?: boolean;
    }
  ): Session;

  export type IncomingTrackStats = {
    bytesReceived: number;
    packetsLost: number;
    packetsReceived: number;
  };

  export type OutgoingTrackStats = {
    bytesSent: number;
    packetsLost: number;
    packetsSent: number;
  }

  export type SubscriberStats = {
    audio: IncomingTrackStats;
    video: IncomingTrackStats & { frameRate: number; };
    timestamp: number;
  }

  export type PublisherStats = {
    audio: OutgoingTrackStats;
    video: OutgoingTrackStats & { frameRate: number; };
    timestamp: number;
  }

  export type PublisherStatContainer = {
    subscriberId?: string,
    connectionId?: string,
    stats: PublisherStats
  }

  export type PublisherStatsArr = PublisherStatContainer[];

  export type PublisherRtcStatsReportContainer = {
    subscriberId?: string,
    connectionId?: string,
    rtcStatsReport: RTCStatsReport
  }

  export type PublisherRtcStatsReportArr = PublisherRtcStatsReportContainer[];

  export class Subscriber extends OTEventEmitter<{
    audioLevelUpdated: Event<'audioLevelUpdated', Subscriber> & {
      audioLevel: number
    };

    connected: Event<'connected', Subscriber>;

    destroyed: Event<'destroyed', Subscriber> & {
      reason: string;
    };

    videoDimensionsChanged: VideoDimensionsChangedEvent<Subscriber>;

    videoDisabled: Event<'videoDisabled', Subscriber> & {
      reason: string;
    };

    videoDisableWarning: Event<'videoDisableWarning', Subscriber>;
    videoDisableWarningLifted: Event<'videoDisableWarningLifted', Subscriber>;

    videoElementCreated: Event<'videoElementCreated', Subscriber> & {
      element: HTMLVideoElement | HTMLObjectElement;
    };

    videoEnabled: Event<'videoEnabled', Subscriber> & {
      reason: string;
    };
  }> {
    element?: HTMLElement;
    id?: string;
    stream?: Stream;

    getAudioVolume(): number;
    getImgData(): string | null;
    getStats(callback: (error?: OTError, stats?: SubscriberStats) => void): void;
    getRtcStatsReport(): Promise<RTCStatsReport>;
    restrictFrameRate(value: boolean): void;
    setAudioVolume(volume: number): void;
    setPreferredFrameRate(frameRate: number): void;
    setPreferredResolution(resolution: Dimensions): void;
    subscribeToAudio(value: boolean): void;
    subscribeToVideo(value: boolean): void;

    setStyle<Style extends keyof SubscriberStyle>(
      style: Style,
      value: SubscriberStyle[Style]
    ): void;

    videoHeight(): number | undefined;
    videoWidth(): number | undefined;
  }

  export function registerScreenSharingExtension(
    kind: string,
    id: string,
    version: number
  ): void;

  export function reportIssue(callback: (error?: OTError, reportId?: string) => void): void;

  export function setLogLevel(level: number): void;

  export function upgradeSystemRequirements(): void;

  export function unblockAudio(): Promise<undefined>;
}
