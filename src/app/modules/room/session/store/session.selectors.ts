import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
import { createSelector, select } from '@ngrx/store';
import { AppState } from '@app/store';
import { adapter } from './session.reducer';
import { ParticipantStatus, ParticipantType, Participant } from './session.model';

export const selectSession = (state: AppState) => state.session;

const { selectAll, selectEntities, selectIds } = adapter.getSelectors(selectSession);

export const selectSessionInitialized = createSelector(
    selectSession,
    session => session.initialized,
);

export const selectSessionReady = pipe(
    select(selectSessionInitialized),
    filter(Boolean),
);

export const selectSessionIds = selectIds as (state: AppState) => string[];

export const selectParticipants = selectAll;

const isOnline = (participant: Participant) => !participant.offline;
export const selectOnlineParticipants = createSelector(
    selectParticipants,
    participants => participants.filter(isOnline),
);

export const selectOnlineParticipantsIds = createSelector(
    selectOnlineParticipants,
    participants => participants.map(p => p.id),
);

export const selectLocalParticipant = createSelector(
    selectParticipants,
    participants => participants.find(p => p.isLocal),
);

export const selectLocalParticipantId = createSelector(
    selectLocalParticipant,
    participant => participant && participant.id,
);

export const selectLocalParticipantType = createSelector(
    selectLocalParticipant,
    participant => participant && participant.type,
);

export const selectIsLocalParticipantHost = createSelector(
    selectLocalParticipantType,
    type => type === ParticipantType.host,
);

export const selectIsLocalParticipantObserver = createSelector(
    selectLocalParticipantType,
    type => type === ParticipantType.observer,
);

export const selectIsLocalParticipantGuest = createSelector(
    selectLocalParticipantType,
    type => type === ParticipantType.guest,
);

export const selectRemoteSessionIds = createSelector(
    selectSessionIds,
    selectLocalParticipantId,
    (sessionIds, localId) => sessionIds.filter(id => id !== localId),
);

export const selectRemoteParticipant = (participantId: string) => createSelector(
    selectRemoteSessionIds,
    selectEntities,
    (remoteIds, entities) => {
        if (!remoteIds.includes(participantId)) {
            return null;
        }
        return entities[participantId];
    },
);

const hasJoined = (participant: Participant) => participant.status === ParticipantStatus.joined;
export const selectJoinedStudents = createSelector(
    selectOnlineParticipants,
    participants => participants
                .filter(p => p.type === ParticipantType.guest && hasJoined(p)),
);

export const selectWaitingRoomList = createSelector(
    selectOnlineParticipants,
    participants => participants.filter(
        p => p.status === ParticipantStatus.waiting
            || p.status === ParticipantStatus.entering
            || p.status === ParticipantStatus.enteringTimeout,
    ),
);

export const selectParticipant = (participantId: string) => createSelector(
    selectEntities,
    entities => entities[participantId],
);

export const selectParticipantType = (participantId: string) => createSelector(
    selectParticipant(participantId),
    participant => participant && participant.type,
);

export const selectIsParticipantEntering = (participantId: string) => createSelector(
    selectParticipant(participantId),
    participant => participant && participant.status === ParticipantStatus.entering,
);

export const selectParticipantIsViewingPage = (participantId: string) => createSelector(
    selectParticipant(participantId),
    participant => participant && participant.isViewingPage,
);

export const selectParticipantIsHost = (participantId: string) => createSelector(
    selectParticipantType(participantId),
    type => type === ParticipantType.host,
);

export const selectParticipantIsGuest = (participantId: string) => createSelector(
    selectParticipantType(participantId),
    type => type === ParticipantType.guest,
);

export const selectParticipantIsLocal = (participantId: string) => createSelector(
    selectLocalParticipantId,
    localId => localId === participantId,
);

export const selectIsParticipantOffline = (participantId: string) => createSelector(
    selectParticipant(participantId),
    participant => participant ? participant.offline : true,
);

export const selectAtLeastOneStudent = createSelector(
    selectJoinedStudents,
    participants => participants.length > 0,
);

export const selectActiveParticipants = createSelector(
    selectOnlineParticipants,
    participants => participants.filter(hasJoined),
);

export const selectIsYoutubeInteractionPending = createSelector(
    selectLocalParticipant,
    participant => participant && participant.isYoutubeInteractionPending,
);

const isIPad = (p: Participant) => p.isIPad;
export const selectIPadGuests = createSelector(
    selectJoinedStudents,
    participants => participants.filter(isIPad),
);

const hasYoutubeInteractionPending = (p: Participant) => p.isYoutubeInteractionPending;
export const selectIPadGuestsWithYoutubeInteractionPending = createSelector(
    selectIPadGuests,
    participants => participants.filter(hasYoutubeInteractionPending),
);

export const selectIsLocalParticipantIPad = createSelector(
    selectLocalParticipant,
    participant => participant && isIPad(participant),
);

export const selectIsLocalParticipantGuestIPad = createSelector(
    selectIsLocalParticipantGuest,
    selectIsLocalParticipantIPad,
    (isGuest, _isIPad) => isGuest && _isIPad,
);

const selectHostParticipant = createSelector(
    selectParticipants,
    participants => participants.find(p => p.type === ParticipantType.host),
);

export const selectHostId = createSelector(
    selectHostParticipant,
    host => host && host.id,
);

export const selectIsHostAbsent = createSelector(
    selectHostParticipant,
    host => !host || (host && host.offline),
);

export const selectGuestIsNotViewingPage = (participantId: string) => createSelector(
    selectIsLocalParticipantHost,
    selectParticipantIsGuest(participantId),
    selectParticipantIsViewingPage(participantId),
    (isLocalHost, isGuest, isViewingPage) => isLocalHost && isGuest ? !isViewingPage : false,
);

export const selectShowVideoStates = (participantId: string) => createSelector(
    selectParticipantIsLocal(participantId),
    selectIsLocalParticipantHost,
    (isLocal, isLocalHost) => isLocal || isLocalHost,
);
