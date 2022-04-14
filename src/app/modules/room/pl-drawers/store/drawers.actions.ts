import { createAction, props } from '@ngrx/store';
import { DrawerNameType } from './drawers.state';

export interface DrawerOpenPayload {
    drawerName: DrawerNameType;
}

const init = createAction('/drawer/init', props<{ open: boolean; drawerName: DrawerNameType }>());
const open = createAction('/drawer/open', props<DrawerOpenPayload>());
const close = createAction('/drawer/close');
const toggle = createAction('/drawer/toggle');

export const DrawerActions = {
    init,
    open,
    close,
    toggle,
};
