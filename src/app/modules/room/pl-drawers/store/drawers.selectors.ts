import { AppState } from '@app/store';
import { createSelector } from '@ngrx/store';

export const selectDrawer = (state: AppState) => state.drawer;

export const selectIsDrawerOpen = createSelector(
    selectDrawer,
    drawer => drawer.open,
);
