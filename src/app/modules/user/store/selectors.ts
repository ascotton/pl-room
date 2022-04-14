import { createSelector } from '@ngrx/store';
import { AppState } from '@root/src/app/store';

export const selectAuth = (store: AppState) => store.auth;

export const selectUserId = createSelector(selectAuth, (state) => {
    return state.userId;
});

export const selectCurrentUser = createSelector(selectAuth, (state)  => {
    return state.user;
});

export const selectUiFlags = createSelector(selectAuth, (state)  => {
    return state.uiFlags;
});

export const selectIsProvider = createSelector(
    selectCurrentUser,
    (user) => {
        return user && user.groups &&
            (user.groups.indexOf('Provider') > -1 ||
            user.groups.indexOf('Service & Support') > -1 ||
            user.groups.indexOf('School Staff Providers') > -1 ||
            user.groups.indexOf('Private Practice') > -1);
    },
);
