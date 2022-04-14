import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { AppState } from '@app/store';
import { selectIsFirebaseConnected } from '@common/firebase/store';
import { selectVideoDevices } from '@common/media/store';
import { ConferenceStatus } from '@common/conference';
import { selectLayoutMode, LayoutMode, selectClientClickMuted } from '@room/app/store';
import {
    selectSessionIds,
    selectIsLocalParticipantHost,
    selectLocalParticipantId,
    selectParticipantIsGuest,
} from '@room/session/store';
import { adapter } from './conference.reducer';
import { StreamType, Stream, StreamLike, LocalStream, RemoteStream } from './conference.model';

export const selectConferenceFeature = (state: AppState) => state.conference;

export const selectConferenceStatus = createSelector(
    selectConferenceFeature,
    conference => conference.status,
);

export const selectScreenshottingId = createSelector(
    selectConferenceFeature,
    conference => conference.screenshottingId,
);

export const selectCapturingId = createSelector(
    selectConferenceFeature,
    conference => conference.capturingId,
);

export const selectIsConferenceConnected = createSelector(
    selectConferenceStatus,
    status => status === ConferenceStatus.connected,
);

export const selectIsRTAndConferenceConnected = createSelector(
    selectIsFirebaseConnected,
    selectIsConferenceConnected,
    (isFirebaseConnected, isConferenceConnected) => isConferenceConnected && isFirebaseConnected,
);

const { selectAll, selectEntities } = adapter.getSelectors(selectConferenceFeature);

const conferenceStreamTypes = new Set([StreamType.primary, StreamType.secondary]);
const isConferenceStream = (stream: Stream) => conferenceStreamTypes.has(stream.type);
const isInSession = (stream: Stream, sessionIds: string[]) => sessionIds.includes(stream.participantId);

const selectConferenceStreams = createSelector(
    selectAll,
    streams => streams.filter(s => isConferenceStream(s)),
);

export const selectConferenceStreamsInSession = createSelector(
    selectConferenceStreams,
    selectSessionIds,
    (streams, sessionIds) => streams.filter(s => isInSession(s, sessionIds)),
);

export const selectConferenceStreamsOutOfSession = createSelector(
    selectConferenceStreams,
    selectSessionIds,
    (streams, sessionIds) => streams.filter(s => !isInSession(s, sessionIds)),
);

const isPrimary = (stream: StreamLike) => stream.type === StreamType.primary;
const isSecondary = (stream: StreamLike) => stream.type === StreamType.secondary;
const isLocalPrimary = (stream: StreamLike) => stream.isLocal && isPrimary(stream);
const isLocalSecondary = (stream: StreamLike) => stream.isLocal && isSecondary(stream);
const isRemotePrimary = (stream: StreamLike) => !stream.isLocal && isPrimary(stream);
const isRemoteSecondary = (stream: StreamLike) => !stream.isLocal && isSecondary(stream);

export const selectConference = createSelector(
    selectConferenceStreamsInSession,
    (streams) => {
        const localPrimary = streams.find(isLocalPrimary);
        const localSecondaries = streams.filter(isLocalSecondary);

        let remotes: StreamLike[] = [];

        const remotePrimaries = streams.filter(isRemotePrimary);

        for (const remotePrimary of remotePrimaries) {
            const remoteSecondaries = streams.filter((s) => {
                const belongToSameParticipant = s.participantId === remotePrimary.participantId;
                return belongToSameParticipant && isRemoteSecondary(s);
            });
            remotes = [
                ...remotes,
                remotePrimary,
                ...remoteSecondaries,
            ];
        }

        return [
            localPrimary,
            ...localSecondaries,
            ...remotes,
        ].filter(Boolean);
    },
);

const selectLocalStreamEntities = createSelector(
    selectEntities,
    (entities) => {
        const map: Dictionary<LocalStream> = {};
        for (const id of Object.keys(entities)) {
            const stream = entities[id];

            if (stream.isLocal) {
                map[id] = stream;
            }
        }
        return map;
    },
);

const selectLocalStreams = createSelector(
    selectLocalStreamEntities,
    entities => Object.values(entities),
);

const selectRemoteStreamEntities = createSelector(
    selectEntities,
    (entities) => {
        const map: Dictionary<RemoteStream> = {};
        for (const id of Object.keys(entities)) {
            const stream = entities[id];

            if (!stream.isLocal) {
                map[id] = stream as RemoteStream;
            }
        }
        return map;
    },
);

export const selectStream = (streamId: string) => createSelector(
    selectEntities,
    entities => entities[streamId],
);

export const selectLocalStream = (streamId: string) => createSelector(
    selectLocalStreamEntities,
    entities => entities[streamId],
);

export const selectLocalPrimaryStream = createSelector(
    selectLocalStreams,
    (streams) => {
        const primary = streams.find(isPrimary);
        return primary;
    },
);

export const selectLocalPrimaryId = createSelector(
    selectLocalPrimaryStream,
    stream => stream && stream.id,
);

export const selectHasLocalJoined = createSelector(
    selectLocalPrimaryStream,
    stream => stream && stream.joined,
);

export const selectRemoteStream = (streamId: string) => createSelector(
    selectRemoteStreamEntities,
    entities => entities[streamId],
);

export const selectStreamIsLocal = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.isLocal,
);

export const selectStreamType = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.type,
);

export const selectStreamIsPrimary = (streamId: string) => createSelector(
    selectStreamType(streamId),
    type => type === StreamType.primary,
);

export const selectStreamDisplayName = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.displayName,
);

export const selectStreamVideoLabel = (streamId: string) => createSelector(
    selectStreamDisplayName(streamId),
    selectStreamIsLocal(streamId),
    (displayName, isLocal) => {
        if (isLocal) {
            return `${displayName} (You)`;
        }

        return displayName;
    },
);

export const selectStreamParticipantId = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.participantId,
);

export const selectStreamIsHidden = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.video.isHidden,
);

export const selectStreamIsMirrored = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.video.effects.isMirrored,
);

export const selectStreamIsRotated = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.video.effects.isRotated,
);

export const selectStreamIsCovered = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.video.effects.isCovered,
);

export const selectStreamIsPromoted = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.isPromoted,
);

export const selectStreamIsMuted = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.microphone && stream.microphone.isMuted,
);

export const selectStreamMic = (streamId: string) => createSelector(
    selectStream(streamId),
    stream => stream && stream.microphone,
);

export const selectStreamMicDevice = (streamId: string) => createSelector(
    selectLocalStream(streamId),
    stream => stream && stream.microphone && stream.microphone.deviceId,
);

export const selectStreamVideoDevice = (streamId: string) => createSelector(
    selectLocalStream(streamId),
    stream => stream && stream.video.deviceId,
);

export const selectUsedVideoDevices = (streamId?: string) =>
    createSelector(
        selectLocalStreams,
        selectLocalStream(streamId),
        (streams, currentStream) => {
            let filteredStreams = streams;
            if (streamId) {
                filteredStreams = streams.filter(s => s.id !== currentStream.id);
            }

            return filteredStreams.map(s => s.video.deviceId);
        },
    );

export const selectAvailableVideoDevices = (streamId?: string) => createSelector(
    selectVideoDevices,
    selectUsedVideoDevices(streamId),
    (devices, usedIds) => devices.filter(d => !usedIds.includes(d.deviceId)),
);

export const selectIsAvailableVideoDevicesEmpty = (streamId?: string) => createSelector(
    selectAvailableVideoDevices(streamId),
    devices => devices.length === 0,
);

export const selectParticipantStreams = (participantId: string) => createSelector(
    selectAll,
    streams => streams.filter(stream => stream.participantId === participantId),
);

export const selectParticipantStreamsIds = (participantId: string) => createSelector(
    selectParticipantStreams(participantId),
    streams => streams.map(({ id }) => id),
);

export const selectSettingsStreams = (participantId: string) => createSelector(
    selectParticipantStreams(participantId),
    (streams) => {
        const primary = streams.find(isPrimary);
        const secondaries = streams.filter(isSecondary);
        return [
            primary,
            ...secondaries,
        ].filter(Boolean).map(s => s.id);
    },
);

export const selectRemoteParticipantStreams = (participantId: string) => createSelector(
    selectRemoteStreamEntities,
    streams => Object.values(streams).filter(stream => stream.participantId === participantId),
);

export const selectParticipantPrimaryStreamId = (participantId: string) => createSelector(
    selectParticipantStreams(participantId),
    (streams) => {
        const primary = streams.find(isPrimary);

        if (!primary) {
            console.warn('No primary stream');
            return null;
        }

        return primary.id;
    },
);

export const selectParticipantSecondaryStreamId = (participantId: string) => createSelector(
    selectParticipantStreams(participantId),
    (streams) => {
        const secondary = streams.find(isSecondary);

        if (!secondary) {
            return null;
        }

        return secondary.id;
    },
);

const selectParticipantPrimaryStream = (participantId: string) => createSelector(
    selectParticipantPrimaryStreamId(participantId),
    selectEntities,
    (primaryId, entities) => entities[primaryId],
);

export const selectParticipantIsMuted = (participantId: string) => createSelector(
    selectParticipantPrimaryStream(participantId),
    stream => stream && stream.microphone && stream.microphone.isMuted,
);

export const selectLocalSecondaryStreamId = createSelector(
    selectLocalStreams,
    (streams) => {
        const secondary = streams.find(isSecondary);
        return secondary && secondary.id;
    },
);

export const selectPromotedStreams = createSelector(
    selectEntities,
    streams => Object.values(streams).filter(stream => !!stream.isPromoted),
);

export const selectPromotedStreamsCount = createSelector(
    selectPromotedStreams,
    promoteds => promoteds.length,
);

export const selectCanPromote = createSelector(
    selectIsLocalParticipantHost,
    selectLayoutMode,
    (isHost, layoutMode) => isHost && layoutMode !== LayoutMode.compact,
);

export const selectShowSecondary = (participantId: string) => createSelector(
    selectLocalParticipantId,
    selectParticipantSecondaryStreamId(participantId),
    (localId, streamId) => {
        const isLocal = localId === participantId;
        const hasSecondary = !!streamId;

        return isLocal || hasSecondary;
    },
);

export const selectIsGuestMuted = (participantId: string) => createSelector(
    selectParticipantIsMuted(participantId),
    selectParticipantIsGuest(participantId),
    (isMuted, isGuest) => isGuest && isMuted,
);

export const selectIsGuestClickMuted = (participantId: string) => createSelector(
    selectParticipantIsGuest(participantId),
    selectClientClickMuted,
    (isGuest, isClientClickMuted) => isGuest && isClientClickMuted,
);

export const selectCanCoverVideo = (streamId: string) => createSelector(
    selectIsLocalParticipantHost,
    selectStreamIsLocal(streamId),
    (isHost, isLocal) => isHost && !isLocal,
);

export const selectCoverVideo = (streamId: string) => createSelector(
    selectStreamIsLocal(streamId),
    selectStreamIsCovered(streamId),
    (isLocal, isCovered) => isLocal && isCovered,
);

export const selectIsStreamVideoDeviceAvailable = (streamId: string) => createSelector(
    selectVideoDevices,
    selectStreamVideoDevice(streamId),
    (devices, currentDevice) => !!devices.find(d => d.deviceId === currentDevice),
);

export const selectIsStreamConnecting = (streamId: string) => createSelector(
    selectStreamIsLocal(streamId),
    selectConferenceStatus,
    (isLocal, status) => isLocal ? status === ConferenceStatus.connecting : false,
);

export const selectIsStreamDisconnected = (streamId: string) => createSelector(
    selectStreamIsLocal(streamId),
    selectConferenceStatus,
    selectIsFirebaseConnected,
    (isLocal, status, isFirebaseConnected) => {
        return isLocal && isFirebaseConnected ? status === ConferenceStatus.disconnected : false;
    },
);

export const selectStreamIsOnlyPromoted = (streamId: string) => createSelector(
    selectStreamIsPromoted(streamId),
    selectPromotedStreamsCount,
    (isPromoted, count) => isPromoted && count === 1,
);

export const selectStreamCanScreenshot = (streamId: string) => createSelector(
    selectStreamIsOnlyPromoted(streamId),
    selectStreamIsHidden(streamId),
    selectIsLocalParticipantHost,
    (isOnlyPromoted, isHidden, isLocalHost) => isOnlyPromoted && !isHidden && isLocalHost,
);

export const selectStreamHasMic = (streamId: string) => createSelector(
    selectStreamMic(streamId),
    mic => !!mic,
);

export const selectStreamCanMute = (streamId: string) => createSelector(
    selectStreamHasMic(streamId),
    selectIsLocalParticipantHost,
    (hasMic, isLocalHost) => hasMic && isLocalHost,
);
