import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { DeviceInfo, MediaState, MediaStateExtras } from './media.model';
import { MediaActions } from './media.actions';

export const mediaEntityAdapter = createEntityAdapter<DeviceInfo>({
    selectId: device => `${device.kind}-${device.deviceId}`,
});

export const initialState: MediaState = mediaEntityAdapter.getInitialState<MediaStateExtras>({
    status: 'loading',
});

export const reducer = createReducer(
    initialState,
    on(
        MediaActions.refresh,
        (state) => {
            return {
                status: 'loading',
                error: null,
                ...state,
            };
        },
    ),
    on(
        MediaActions.refreshSuccess,
        (state, { devices }) => {
            const newState = mediaEntityAdapter.addAll(devices, state);

            newState.status = 'success';
            newState.error = null;

            return newState;
        },
    ),
    on(
        MediaActions.refreshError,
        (state, action) => {
            return {
                ...state,
                error: action.error,
                status: 'error' as MediaState['status'],
            };
        },
    ),
);
