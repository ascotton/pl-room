import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { ConferenceStatus } from '@common/conference';
import {
    ConferenceState,
    ConferenceStateExtras,
    StreamLike,
    StreamMicrophone,
    LocalStream,
} from './conference.model';
import { ConferenceActions, ConferenceActionTypes } from './conference.actions';

export const adapter = createEntityAdapter<StreamLike>();

export const initialState: ConferenceState = adapter.getInitialState<ConferenceStateExtras>({
    initialized: false,
    screenshottingId: null,
    capturingId: null,
    status: ConferenceStatus.idle,
});

export const reducer = createReducer(
    initialState,
    on(ConferenceActions.setConferenceStatus, (state, { status }) => {
        return {
            ...state,
            status,
        };
    }),
    on(
        ConferenceActions.joinSuccess,
        ConferenceActions.joinError,
        (state, { id, type }) => {
            const joined = type === ConferenceActionTypes.joinSuccess;
            return updateOne(id, { joined }, state);
        },
    ),
    on(
        ConferenceActions.setDefaultMedia,
        (state, { id, devices }) => {
            const entity = state.entities[id];

            if (!entity.isLocal) {
                return state;
            }

            const { audio: newAudioId, video: newVideoId } = devices;

            return updateOne<LocalStream>(
                id,
                {
                    microphone: {
                        deviceId: newAudioId,
                    },
                    video: {
                        deviceId: newVideoId,
                    },
                },
                state,
            );
        },
    ),
    on(
        ConferenceActions.showSuccess,
        ConferenceActions.hideSuccess,
        (state, { id, type }) => {
            const isHidden = type === ConferenceActionTypes.hideSuccess;
            return updateOne(id, { video: { isHidden } }, state);
        },
    ),
    on(
        ConferenceActions.muteSuccess,
        ConferenceActions.unmuteSuccess,
        ConferenceActions.setIsMutedRemotely,
        (state, action) => {
            const { id } = action;
            let isMuted: boolean;

            if (action.type === ConferenceActionTypes.setIsMutedRemotely) {
                isMuted = action.isMuted;
            } else {
                isMuted = action.type === ConferenceActionTypes.muteSuccess;
            }
            return updateOne(id, { microphone: { isMuted } }, state);
        },
    ),
    on(
        ConferenceActions.addLocalPrimarySuccess,
        ConferenceActions.addLocalSecondarySuccess,
        ConferenceActions.addRemote,
        (state, { stream }) => {
            return addOne(stream, state);
        },
    ),
    on(
        ConferenceActions.updateRemote,
        (state, { id, stream }) => {
            return updateOne(id, stream, state);
        },
    ),
    on(
        ConferenceActions.removeLocalSecondarySuccess,
        ConferenceActions.removeRemote,
        ConferenceActions.removeOutOfSessionStreamSuccess,
        (state, { id }) => {
            return adapter.removeOne(id, state);
        },
    ),
    on(
        ConferenceActions.setMicDeviceSuccess,
        (state, { streamId, micDevice }) => {
            return updateOne(streamId, { microphone: { deviceId: micDevice } }, state);
        },
    ),
    on(
        ConferenceActions.mirror,
        ConferenceActions.unmirror,
        (state, { id, type }) => {
            const isMirrored = type === ConferenceActionTypes.mirror;
            return updateOne(id, { video: { effects: { isMirrored } } }, state);
        },
    ),
    on(
        ConferenceActions.rotate,
        ConferenceActions.derotate,
        (state, { id, type }) => {
            const isRotated = type === ConferenceActionTypes.rotate;
            return updateOne(id, { video: { effects: { isRotated } } }, state);
        },
    ),
    on(
        ConferenceActions.setDisplayNameSuccess,
        ConferenceActions.setDisplayNameRemotely,
        (state, { id, displayName }) => {
            return updateOne(id, { displayName }, state);
        },
    ),
    on(
        ConferenceActions.setVideoDeviceSuccess,
        (state, { id, videoDevice }) => {
            return updateOne(id, { video: { deviceId: videoDevice } }, state);
        },
    ),
    on(
        ConferenceActions.startScreenshotting,
        (state, { id }) => {
            return {
                ...state,
                screenshottingId: id,
            };
        },
    ),
    on(
        ConferenceActions.stopScreenshotting,
        (state) => {
            return {
                ...state,
                screenshottingId: null,
            };
        },
    ),
    on(
        ConferenceActions.startCapturing,
        (state, { id }) => {
            return {
                ...state,
                capturingId: id,
            };
        },
    ),
    on(
        ConferenceActions.stopCapturing,
        (state) => {
            return {
                ...state,
                capturingId: null,
            };
        },
    ),
    on(
        ConferenceActions.promoteSuccess,
        ConferenceActions.demoteSuccess,
        ConferenceActions.setIsPromotedRemotely,
        (state, action) => {
            const { id } = action;
            let isPromoted: boolean;

            if (action.type === ConferenceActionTypes.setIsPromotedRemotely) {
                isPromoted = action.isPromoted;
            } else {
                isPromoted = action.type === ConferenceActionTypes.promoteSuccess;
            }

            return updateOne(id, { isPromoted }, state);
        },
    ),
    on(
        ConferenceActions.coverSuccess,
        ConferenceActions.uncoverSuccess,
        ConferenceActions.setIsCoveredRemotely,
        (state, action) => {
            const { id } = action;
            let isCovered: boolean;

            if (action.type === ConferenceActionTypes.setIsCoveredRemotely) {
                isCovered = action.isCovered;
            } else {
                isCovered = action.type === ConferenceActionTypes.coverSuccess;
            }
            return updateOne(id, { video: { effects: { isCovered } } }, state);
        },
    ),
);

function addOne<T extends StreamLike>(stream: T, state: ConferenceState) {
    let microphone: StreamMicrophone;

    if (stream.microphone) {
        microphone = {
            ...stream.microphone,
        };
    }

    return adapter.addOne(
        {
            ...stream,
            microphone,
            video: {
                ...stream.video,
                effects: {
                    ...stream.video.effects,
                },
            },
        },
        state,
    );
}

function updateOne<T extends StreamLike>(id: string, changes: PartialDeep<T>, state: ConferenceState) {
    const entity = state.entities[id];

    if (!entity) {
        console.warn('Stream not found', id, changes);
        return state;
    }

    if (!changes) {
        console.warn('No changes to apply', id, changes);
        return state;
    }

    let microphone: StreamMicrophone;

    if (entity.microphone) {
        microphone = {
            ...entity.microphone,
            ...changes.microphone,
        };
    }

    return adapter.updateOne(
        {
            id,
            changes: {
                ...changes,
                microphone,
                video: {
                    ...entity.video,
                    ...changes.video,
                    effects: {
                        ...entity.video.effects,
                        ...changes.video && changes.video.effects,
                    },
                },
            },
        },
        state,
    );
}
