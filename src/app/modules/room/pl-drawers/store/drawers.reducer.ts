import {  createReducer, on } from '@ngrx/store';
import { DrawerState, initialState } from './drawers.state';
import { DrawerActions, DrawerOpenPayload } from './drawers.actions';

function openAction(_state: DrawerState, action: DrawerOpenPayload) {
    return {
        open: true,
        activeName: action.drawerName,
    };
}

function closeAction(state: DrawerState) {
    return {
        ...state,
        open: false,
    };
}

export const reducer = createReducer(
    initialState,
    on(DrawerActions.init, (_, { open, drawerName }) => {
        return {
            open,
            activeName: drawerName,
        };
    }),
    on(DrawerActions.open, openAction),
    on(DrawerActions.close, closeAction),
    on(DrawerActions.toggle, (state) => {
        if (!state.open) {
            return openAction(state, { drawerName: state.activeName });
        }
        return closeAction(state);
    }),
);
