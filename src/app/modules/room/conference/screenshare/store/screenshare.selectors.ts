import { AppState } from '@app/store';
import { createSelector } from '@ngrx/store';
import { ScreenshareStatus } from './screenshare.model';

export const selectScreenshareFeature = (state: AppState) => state.screenshare;

export const selectIsScreenshareActive = createSelector(
    selectScreenshareFeature,
    media => media.status === ScreenshareStatus.sharing,
);
