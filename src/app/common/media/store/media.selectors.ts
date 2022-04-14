import { AppState } from '@app/store';
import { mediaEntityAdapter } from './media.reducer';
import { createSelector } from '@ngrx/store';

export const selectMediaFeature = (state: AppState) => state.media;

const { selectAll } = mediaEntityAdapter.getSelectors(selectMediaFeature);

export const selectIsMediaLoading = createSelector(
    selectMediaFeature,
    media => media.status === 'loading',
);

export const selectDevices = selectAll;

export const selectAudioDevices = createSelector(
    selectDevices,
    devices => devices.filter(d => d.kind === 'audioinput'),
);

export const selectVideoDevices = createSelector(
    selectDevices,
    devices => devices.filter(d => d.kind === 'videoinput'),
);
