export enum LayoutMode {
    compact = 'compact',
    jumbotron = 'jumbotron',
    grid = 'grid',
}

export interface AppConfig {
    isCursorShared: boolean;
    isClientClickMuted: boolean;
    isToggleDisabled: boolean;
    layoutMode: LayoutMode;
}

export type AppConfigState = AppConfig;
