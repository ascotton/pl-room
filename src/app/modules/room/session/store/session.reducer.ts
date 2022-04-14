import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { SessionState, Participant, ParticipantStatus } from './session.model';
import { SessionActions, SessionActionTypes } from './session.actions';

export const adapter = createEntityAdapter<Participant>();

export const initialState: SessionState = adapter.getInitialState({
    initialized: false,
});

export const reducer = createReducer(
    initialState,
    on(
        SessionActions.initObserver,
        SessionActions.addLocalSuccess,
        SessionActions.addWaitingSuccess,
        SessionActions.addedRemotely,
        (state, { type, participant }) => {
            const newState = adapter.addOne(participant, state);

            if (type === SessionActionTypes.addLocalSuccess || type === SessionActionTypes.initObserver) {
                newState.initialized = true;
            }

            return newState;
        },
    ),
    on(
        SessionActions.setLocalOffline,
        (state, { id, offline }) => {
            return adapter.updateOne({ id, changes: { offline } }, state);
        },
    ),
    on(
        SessionActions.updatedRemotely,
        (state, { id, participant }) => {
            const newState = adapter.updateOne({ id, changes: participant }, state);

            const entity = newState.entities[id];

            if (entity.offline && !participant.offline) {
                entity.offline = null;
                entity.offlineAt = null;
            }

            return newState;
        },
    ),
    on(
        SessionActions.removedRemotely,
        SessionActions.kickSuccess,
        (state, { id }) => {
            return adapter.removeOne(id, state);
        },
    ),
    on(
        SessionActions.setIsViewingPageSuccess,
        (state, { id, isViewingPage }) => {
            return adapter.updateOne({ id, changes: { isViewingPage } }, state);
        },
    ),
    on(
        SessionActions.admitSuccess,
        (state, { id }) => {
            const status = ParticipantStatus.entering;
            return adapter.updateOne({ id, changes: { status } }, state);
        },
    ),
);
