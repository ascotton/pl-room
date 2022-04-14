import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ConferenceProviderEventKey, ConferenceProviderEventMap, JoinedEvent, ChangedEvent, LeftEvent } from './conference-provider-events';
import { ConferenceStream } from './conference-stream';
import { distinctUntilChanged } from 'rxjs/operators';

export enum ConferenceStatus {
    idle = 'idle',
    connecting = 'connecting',
    connected = 'connected',
    disconnected = 'disconnected',
}

export type MediaSource = string | boolean;
export interface JoinConfig {
    audioSource?: MediaSource;
    videoSource?: MediaSource;
    isMuted?: boolean;
    isHidden?: boolean;
}

export abstract class ConferenceProvider {
    private streams = new Map<string, ConferenceStream>();
    private eventSubjects = new Map<ConferenceProviderEventKey, Subject<any>>();
    private mediaStreamSubjects = new Map<string, BehaviorSubject<MediaStream | null>>();

    private statusSubject = new BehaviorSubject(ConferenceStatus.idle);

    abstract init(): Observable<void>;

    abstract dispose(): void;

    abstract join(id: string, config?: JoinConfig): Observable<void>;

    abstract leave(id: string): void;

    abstract setVideoSource(id: string, source: string): Observable<void>;

    abstract setAudioSource(id: string, source: string): Observable<void>;

    abstract mute(id: string): void;

    abstract unmute(id: string): void;

    abstract show(id: string): void;

    abstract hide(id: string): void;

    abstract startScreenshare(id: string): Observable<void>;

    abstract stopScreenshare(id: string): void;

    abstract signal(data: any, type: string, ...params: any[]): Observable<any>;

    abstract onSignalEvent(event: string): Observable<any>;

    getStreams() {
        return Array.from(this.streams.values());
    }

    getStatus() {
        return this.statusSubject.asObservable().pipe(
            distinctUntilChanged(),
        );
    }

    getMediaStream(id: string) {
        return this.getMediaStreamSubject(id).asObservable();
    }

    on<K extends ConferenceProviderEventKey>(event: K): Observable<ConferenceProviderEventMap[K]> {
        return this.getEventSubject(event).asObservable();
    }

    protected emit<K extends ConferenceProviderEventKey>(event: K, data?: ConferenceProviderEventMap[K]): void {
        switch (event) {
                case 'connected':
                    this.handleConnected();
                    break;
                case 'disconnected':
                    this.handleDisconnected();
                    break;
                case 'joined':
                    this.handleJoined(data as JoinedEvent);
                    break;
                case 'changed':
                    this.handleChanged(data as ChangedEvent);
                    break;
                case 'left':
                    this.handleLeft(data as LeftEvent);
                    break;
        }
        this.getEventSubject(event).next(data);
    }

    getStream(id: string) {
        return this.streams.get(id);
    }

    protected setStatus(status: ConferenceStatus) {
        this.statusSubject.next(status);
    }

    private handleConnected() {
        this.setStatus(ConferenceStatus.connected);
    }

    private handleDisconnected() {
        this.setStatus(ConferenceStatus.disconnected);
    }

    private handleJoined(ev: JoinedEvent) {
        this.setStream(ev.id, ev);
    }

    private handleChanged(ev: ChangedEvent) {
        this.setStream(ev.id, ev);
    }

    private handleLeft(ev: LeftEvent) {
        this.deleteStream(ev.id);
    }

    private setStream(id: string, stream: ConferenceStream) {
        this.streams.set(id, stream);
        this.getMediaStreamSubject(id).next(stream.mediaStream);
    }

    private deleteStream(id: string) {
        this.streams.delete(id);
        this.getMediaStreamSubject(id).next(null);
    }

    private getEventSubject<K extends ConferenceProviderEventKey>(event: K): Subject<ConferenceProviderEventMap[K]> {
        if (!this.eventSubjects.has(event)) {
            this.eventSubjects.set(event, new Subject());
        }
        return this.eventSubjects.get(event);
    }

    private getMediaStreamSubject(id: string) {
        if (!this.mediaStreamSubjects.has(id)) {
            this.mediaStreamSubjects.set(id, new BehaviorSubject<MediaStream | null>(null));
        }
        return this.mediaStreamSubjects.get(id);
    }
}
