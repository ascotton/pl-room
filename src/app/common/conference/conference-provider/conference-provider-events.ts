import { ConferenceStream } from './conference-stream';

export interface ConferenceProviderEventMap {
    joined: JoinedEvent;

    changed: ChangedEvent;

    left: LeftEvent;

    connected: never;

    disconnected: never;
}

export type ConferenceProviderEventKey = keyof ConferenceProviderEventMap;

export type ChangedEvent = ConferenceStream;

export interface JoinedEvent extends ConferenceStream {
    audioSource?: string;
    videoSource?: string;
}

export interface LeftEvent {
    id: string;
    reason: string;
}
