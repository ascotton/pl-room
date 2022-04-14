import { EntityState } from '@ngrx/entity';
import { ConferenceStatus } from '@common/conference';

export interface ConferenceStateExtras {
    initialized: boolean;
    screenshottingId: string;
    capturingId: string;
    status: ConferenceStatus;
}

export type ConferenceState = EntityState<StreamLike> & ConferenceStateExtras;

export interface RTStream {
    id: string;
    type: StreamType;
    displayName: string;
    participantId: string;
    video: RTStreamVideo;
    microphone?: RTStreamMicrophone;
    isPromoted?: boolean;
}

export interface RTStreamMicrophone {
    isMuted: boolean;
}

export interface RTStreamVideo {
    isHidden: boolean;
    effects: RTStreamVideoEffects;
}

export interface RTStreamVideoEffects {
    isCovered: boolean;
}

export interface Stream extends RTStream {
    video: StreamVideo;
    joined?: boolean;
}

export enum StreamType {
    primary = 'primary',
    secondary = 'secondary',
}

export type StreamMicrophone = RTStreamMicrophone;

export interface StreamVideo extends RTStreamVideo {
    effects: StreamVideoEffects;
}

export interface StreamVideoEffects extends RTStreamVideoEffects {
    isMirrored: boolean;
    isRotated: boolean;
}

export interface RemoteStream extends Stream {
    isLocal: false;
}

export interface LocalStream extends Stream {
    isLocal: true;
    video: LocalStreamVideo;
    microphone?: LocalStreamMicrophone;
}

export interface LocalStreamVideo extends StreamVideo, LocalStreamMedia {
    effects: LocalStreamVideoEffects;
}

export interface LocalStreamVideoEffects extends StreamVideoEffects {
    isBackgroundBlurred: boolean;
}

export interface LocalStreamMicrophone extends StreamMicrophone, LocalStreamMedia {}

export interface LocalStreamMedia {
    deviceId?: string;
}

export type StreamLike = LocalStream | RemoteStream;
