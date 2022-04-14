import { AppState } from '@app/store';
import { createSelector } from '@ngrx/store';
import { LayoutMode } from './app.model';
export const selectAppConfig = (state: AppState) => state.app;

export const selectSharedCursorOn = createSelector(
    selectAppConfig,
    app => app.isCursorShared,
);

export const selectClientClickMuted = createSelector(
    selectAppConfig,
    app => app.isClientClickMuted,
);

export const selectSharedCursorToggleDisabled = createSelector(
    selectAppConfig,
    app => app.isToggleDisabled,
);

export const selectLayoutMode = createSelector(
    selectAppConfig,
    app => app.layoutMode,
);

export const selectIsLayoutModeFullScreen = createSelector(
    selectLayoutMode,
    layoutMode => layoutMode !== LayoutMode.compact,
);
