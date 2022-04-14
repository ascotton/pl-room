import { EntityState } from '@ngrx/entity';

export interface SessionStateExtras {
    initialized: boolean;
}

export type SessionState = EntityState<Participant> & SessionStateExtras;

export type RTParticipant = Omit<Participant, 'isLocal'>;
export interface Participant {
    id: string;
    isLocal: boolean;
    userId: string;
    displayName: string;
    type: ParticipantType;
    status: ParticipantStatus;
    isIPad: boolean;
    offline?: boolean;
    offlineAt?: number;
    isYoutubeInteractionPending: boolean;
    isViewingPage: boolean;
    omitFromSessionRecord: boolean;
    joinMuted: boolean;
}

export enum ParticipantType {
    host = 'host',
    observer = 'observer',
    guest = 'guest',
}

export enum ParticipantStatus {
    idle = 'idle',
    waiting = 'waiting',
    entering = 'entering',
    joined = 'joined',
    dismissed = 'dismissed',
    enteringTimeout = 'entering-timeout',
}
