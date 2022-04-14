import { Injectable } from '@angular/core';
import { TokboxConfig, ConferenceProvider, TokboxConferenceProvider, JoinConfig } from '@common/conference';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

export interface ConferenceConfig {
    tokbox?: TokboxConfig;
}

@Injectable({ providedIn: 'root' })
export class ConferenceService {
    private conference: ConferenceProvider;
    private readySubject = new BehaviorSubject(false);
    private instantiatedSubject = new BehaviorSubject(false);
    public isReady$: Observable<boolean>;

    constructor() {
        this.isReady$ = this.readySubject.asObservable();
    }

    setConfig(config: ConferenceConfig) {
        const { tokbox } = config;
        if (!tokbox) {
            throw new Error('ConferenceService needs the provider credentials');
        }

        this.conference = new TokboxConferenceProvider(tokbox);
        this.instantiatedSubject.next(true);
    }

    init() {
        return this.conference.init().pipe(
            tap(() => this.readySubject.next(true)),
        );
    }

    getProviderId(id: string) {
        const stream = this.conference.getStream(id);

        return stream && stream.providerId;
    }

    join(id: string, config: JoinConfig) {
        return this.conference.join(id, config);
    }

    leave(id: string) {
        return this.conference.leave(id);
    }

    getStatus() {
        return this.onInstantiated().pipe(
            switchMap(() => this.conference.getStatus()),
        );
    }

    getMediaStream(id: string) {
        return this.onReady().pipe(
            switchMap(() => this.conference.getMediaStream(id)),
        );
    }

    startScreenshare(id: string) {
        return this.conference.startScreenshare(id);
    }

    stopScreenshare(id: string) {
        return this.conference.stopScreenshare(id);
    }

    setAudioSource(id: string, source: string) {
        return this.conference.setAudioSource(id, source);
    }

    setVideoSource(id: string, source: string) {
        return this.conference.setVideoSource(id, source);
    }

    mute(id: string) {
        this.conference.mute(id);
    }

    unmute(id: string) {
        this.conference.unmute(id);
    }

    show(id: string) {
        this.conference.show(id);
    }

    hide(id: string) {
        this.conference.hide(id);
    }

    onJoined() {
        return this.onReady().pipe(
            switchMap(() => this.conference.on('joined')),
        );
    }

    signal(data: any, type: string, ...rest: any[]) {
        return this.conference.signal(data, type, ...rest);
    }

    onSignalEvent(event: string) {
        return this.onReady().pipe(
            switchMap(() => this.conference.onSignalEvent(event)),
        );
    }

    forceDisconnect(id: string) {
        return (this.conference as TokboxConferenceProvider).forceDisconnect(id);
    }

    onReady() {
        return this.isReady$.pipe(
            filter(Boolean),
        );
    }

    onInstantiated() {
        return this.instantiatedSubject.pipe(
            filter(Boolean),
        );
    }
}
