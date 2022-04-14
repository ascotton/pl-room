import { createAction, props } from '@ngrx/store';
import { AppConfigState, LayoutMode } from './app.model';

const setCursorSharing = createAction(
    '/app/setCursorSharing',
    props<{ isCursorShared: boolean; isToggleDisabled: boolean; }>(),
);

const setCursorSharingSuccess = createAction(
    '/app/setCursorSharingSuccess',
    props<{ isCursorShared: boolean; isToggleDisabled: boolean; }>(),
);

const setClientMouseClick = createAction(
    '/app/setClientMouseClick',
    props<{ isClientClickMuted: boolean; }>(),
);

const setClientMouseClickSuccess = createAction(
    '/app/setClientMouseClickSuccess',
    props<{ isClientClickMuted: boolean; }>(),
);

const setLayoutMode = createAction(
    '/app/setLayoutMode',
    props<{ layoutMode: LayoutMode }>(),
);

const setLayoutModeSuccess = createAction(
    '/app/setLayoutModeSuccess',
    props<{ layoutMode: LayoutMode }>(),
);

const updateFromRemote = createAction(
    '/app/updateFromRemote',
    props<{ data: AppConfigState; }>(),
);

const updateFailed = createAction(
    '/app/updateFailed',
    props<{ error: any }>(),
);

export const AppActions = {
    setCursorSharing,
    setCursorSharingSuccess,
    setClientMouseClick,
    setClientMouseClickSuccess,
    setLayoutMode,
    setLayoutModeSuccess,
    updateFromRemote,
    updateFailed,
};
