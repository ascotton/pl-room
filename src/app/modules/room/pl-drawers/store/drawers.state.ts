export type DrawerNameType = 'document' | 'teamWrite' |
'roomOverlay' | 'cobrowse' | 'activities' | 'chat' | 'animation' |
'sessionRecord' | 'widget' | 'games' | 'homework';

export interface DrawerState {
    open: boolean;
    activeName: DrawerNameType;
}

export const initialState: DrawerState = {
    open: false,
    activeName: 'activities',
};
