import { createReducer, on } from '@ngrx/store';
import { AppConfig, LayoutMode } from './app.model';
import { AppActions } from './app.actions';

export const initialState: AppConfig = {
    isClientClickMuted: false,
    isCursorShared: false,
    isToggleDisabled: false,
    layoutMode: LayoutMode.compact,
};

export const reducer = createReducer(
    initialState,
    on(AppActions.setCursorSharingSuccess, (state, { isCursorShared, isToggleDisabled }) => {
        return {
            ...state,
            isCursorShared,
            isToggleDisabled,
        };
    }),
    on(AppActions.setClientMouseClickSuccess, (state, { isClientClickMuted }) => {
        return {
            ...state,
            isClientClickMuted,
        };
    }),
    on(AppActions.setLayoutModeSuccess, (state, { layoutMode }) => {
        return {
            ...state,
            layoutMode,
        };
    }),
    on(AppActions.updateFromRemote, (state, { data }) => {
        return {
            ...state,
            ...data,
        };
    }),
);
