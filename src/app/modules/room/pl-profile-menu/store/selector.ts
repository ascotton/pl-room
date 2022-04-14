import { createSelector } from '@ngrx/store';
import { AppState } from '@app/store';

export const selectProfileMenu = (state: AppState) => state.profileMenu;

export const selectIsShown = createSelector(selectProfileMenu, (state)  => {
    return state.show;
});
