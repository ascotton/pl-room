import { Observable, from, bindNodeCallback, throwError, of, EMPTY }from 'rxjs';
import { ConferenceProvider, JoinConfig, MediaSource, ConferenceStatus } from './conference-provider/conference-provider';
import { tap, switchMap } from 'rxjs/operators';
import { ConferenceStreamType } from './conference-provider/conference-stream';

export interface TokboxConfig {
    apiKey: string;
    connectionToken: string;
    conferenceId: string;
}

export interface TokboxJoinConfig extends JoinConfig {
    fps?: 15 | 30 | 7 | 1;
    resolution?:
        | '640x480'
        | '1280x960'
        | '1280x720'
        | '640x360'
        | '320x240'
        | '320x180';
}

export const DefaultBroadcastOptions: TokboxJoinConfig = {
    fps: 15,
    resolution: '640x480',
};

type PublishFn = (publisher: OT.Publisher, callback?: (error?: OT.OTError) => void) => OT.Publisher;

export class TokboxConferenceProvider extends ConferenceProvider {
    private session: OT.Session;

    private publishers = new Map<string, OT.Publisher>();
    private subscribers = new Map<string, OT.Subscriber>();

    constructor(private config: TokboxConfig) {
        super();
    }

    init(): Observable<void> {
        const { apiKey, conferenceId, connectionToken } = this.config;

        if (typeof OT === 'undefined') {
            this.setStatus(ConferenceStatus.disconnected);
            return throwError(new Error('OT script is not available'));
        }

        this.session = OT.initSession(apiKey, conferenceId, {
            ipWhitelist: true,
        });

        this.setupSubscribers();

        this.setupConnectionListeners();

        this.setStatus(ConferenceStatus.connecting);

        return this.connect(connectionToken).pipe(
            tap({
                error: () => {
                    this.setStatus(ConferenceStatus.disconnected);
                },
            }),
        );
    }

    dispose(): void {
        this.session.disconnect();
    }

    join(id: string, config?: TokboxJoinConfig): Observable<void> {
        const pub = this.createPublisher(id, config);
        return this.publish(pub);
    }

    leave(id: string): void {
        if (!this.publishers.has(id)) {
            return;
        }
        this.session.unpublish(this.publishers.get(id));
    }

    setVideoSource(id: string, source: string): Observable<void> {
        return this.getPublisherOrFail(id).pipe(
            switchMap((pub) => {
                return from(pub.setVideoSource(source)).pipe(
                    tap(() => {
                        this.emit('changed', this.getStream(id));
                    }),
                );
            }),
        );
    }

    setAudioSource(id: string, source: string): Observable<void> {
        return this.getPublisherOrFail(id).pipe(
            switchMap((pub) => {
                return from(pub.setAudioSource(source)).pipe(
                    tap(() => {
                        this.emit('changed', this.getStream(id));
                    }),
                );
            }),
        );
    }

    mute(id: string): void {
        if (!this.publishers.has(id)) {
            return;
        }
        const pub = this.publishers.get(id);
        pub.publishAudio(false);
    }

    unmute(id: string): void {
        if (!this.publishers.has(id)) {
            return;
        }
        const pub = this.publishers.get(id);
        pub.publishAudio(true);
    }

    show(id: string): void {
        if (!this.publishers.has(id)) {
            return;
        }
        const pub = this.publishers.get(id);
        pub.publishVideo(true);
    }

    hide(id: string): void {
        if (!this.publishers.has(id)) {
            return;
        }
        const pub = this.publishers.get(id);
        pub.publishVideo(false);
    }

    startScreenshare(id: string): Observable<void> {
        return this.join(id, {
            audioSource: false,
            videoSource: 'window',
            resolution: '1280x720',
            isMuted: true,
            isHidden: false,
        });
    }

    stopScreenshare(id: string): void {
        return this.leave(id);
    }

    signal(data: any, type: string, to?: OT.Connection) {
        const payload: any = { type, data };
        if (to) {
            payload.to = to;
        }
        return bindNodeCallback(
            this.session.signal.bind(this.session),
        )(payload);
    }

    onSignalEvent(event: string) {
        return new Observable((observer) => {
            this.session.on(`signal:${event}`, (data) => {
                observer.next(data);
            });
        });
    }

    forceDisconnect(id: string) {
        if (!(this.session && this.session.capabilities.forceDisconnect)) {
            console.warn('You are not allowed to use forceDisconnect');
            return EMPTY;
        }

        if (!this.subscribers.has(id)) {
            console.warn('Subscriber not in session');
            return EMPTY;
        }

        const sub = this.subscribers.get(id);

        return bindNodeCallback(
            this.session.forceDisconnect.bind(this.session) as OT.Session['forceDisconnect'],
        )(sub.stream.connection);
    }

    private getPublisherOrFail(id: string) {
        if (!this.publishers.has(id)) {
            return throwError(new Error('Stream is not in conference'));
        }

        return of(this.publishers.get(id));
    }

    private createPublisher(
        id: string,
        config: TokboxJoinConfig,
    ): OT.Publisher {
        const {
            isMuted = true,
            isHidden = true,
            fps = 15,
            resolution = '640x480',
        } = config;

        const pub = OT.initPublisher(
            // Passing undefined for the target element since the
            // insertDefaultUI option is disabled.
            // https://tokbox.com/developer/guides/customize-ui/js/#video-element
            undefined,
            {
                resolution,
                audioSource: this.normalizeSource(config.audioSource),
                videoSource: this.normalizeSource(config.videoSource),
                name: id,
                showControls: false,
                frameRate: fps,
                insertDefaultUI: false,
                publishAudio: !isMuted,
                publishVideo: !isHidden,
            },
        );

        this.publishers.set(id, pub);

        let pubMediaStream: MediaStream;
        let pubStream: OT.Stream;

        pub.on('streamCreated', ({ stream }) => {
            pubStream = stream;
            this.tryEmitJoined(id, pubStream, pubMediaStream);
        });

        pub.on('videoElementCreated', ({ element }) => {
            pubMediaStream = (element as HTMLVideoElement).srcObject as MediaStream;
            this.tryEmitJoined(id, pubStream, pubMediaStream);
        });

        pub.on('streamDestroyed', ({ reason }) => {
            if (!this.getStream(id)) {
                return;
            }
            this.publishers.delete(id);
            this.emit('left', {
                id,
                reason,
            });
        });

        return pub;
    }

    private tryEmitJoined = (id: string, stream?: OT.Stream, mediaStream?: MediaStream) => {

        if (stream && mediaStream) {
            const { audioSource, videoSource } = this.getDevices(id);

            this.emit('joined', {
                id,
                mediaStream,
                audioSource,
                videoSource,
                type: this.getStreamType(stream),
                providerId: stream.streamId,
            });
        }
    }

    private getDevices(id: string) {
        const { getAudioSource, getVideoSource } = this.publishers.get(id);

        let audioSource: string;
        let videoSource: string;

        const pubAudioSource = getAudioSource();
        if (pubAudioSource) {
            audioSource = pubAudioSource.getSettings().deviceId;
        }

        const pubVideoSource = getVideoSource();
        if (pubVideoSource) {
            videoSource = pubVideoSource.deviceId;
        }

        return {
            audioSource,
            videoSource,
        };
    }

    private normalizeSource(source?: MediaSource) {
        // Sending 'true' to tokbox results in an invalid source warning
        if (source === true) {
            return undefined;
        }

        return source;
    }

    private setupSubscribers() {
        this.session.on('streamCreated', ({ stream }) => {
            const sub = this.session.subscribe(
                stream,
                // Passing undefined for the target element since the
                // insertDefaultUI option is disabled.
                // https://tokbox.com/developer/guides/customize-ui/js/#video-element
                undefined,
                { insertDefaultUI: false },
            );

            const streamId = stream.name;

            this.subscribers.set(streamId, sub);

            sub.on('videoElementCreated', ({ element }) => {
                this.emit('joined', {
                    id: streamId,
                    providerId: stream.streamId,
                    mediaStream: (element as HTMLVideoElement).srcObject as MediaStream,
                    type: this.getStreamType(stream),
                });
            });
        });

        this.session.on('streamPropertyChanged', ({ stream }) => {
            const streamId = stream.name;
            const conferenceStream = this.getStream(streamId);
            if (!conferenceStream) {
                return;
            }
            this.emit('changed', this.getStream(streamId));
        });

        this.session.on('streamDestroyed', ({ reason, stream }) => {
            const streamId = stream.name;
            if (!this.getStream(streamId)) {
                return;
            }
            this.subscribers.delete(streamId);
            this.emit('left', {
                reason,
                id: streamId,
            });
        });
    }

    private setupConnectionListeners() {
        this.session.on('sessionConnected', (ev) => {
            this.emit('connected');
        });

        this.session.on('sessionDisconnected', (ev) => {
            this.emit('disconnected');
        });

        this.session.on('sessionReconnecting', (ev) => {
            this.setStatus(ConferenceStatus.connecting);
        });

        this.session.on('sessionReconnected', (ev) => {
            this.setStatus(ConferenceStatus.connected);
        });
    }

    private getStreamType(stream: OT.Stream) {
        if (stream.videoType === 'camera') {
            return ConferenceStreamType.camera;
        }

        if (stream.videoType === 'screen') {
            return ConferenceStreamType.screen;
        }

        return ConferenceStreamType.custom;
    }

    private connect(token: string) {
        return bindNodeCallback(this.session.connect.bind(this.session) as OT.Session['connect'])(token);
    }

    private publish(publisher: OT.Publisher) {
        return bindNodeCallback(this.session.publish.bind(this.session) as PublishFn)(publisher);
    }
}
