import { createReducer, on } from '@ngrx/store';
import { FirebaseState } from './firebase.model';
import { FirebaseActions } from './firebase.actions';

export const initialState: FirebaseState = {
    status: 'idle',
    isConnected: false,
};

export const reducer = createReducer(
    initialState,
    on(FirebaseActions.setInitialized, (state): FirebaseState => {
        return {
            ...state,
            status: 'initialized',
        };
    }),
    on(FirebaseActions.setIsConnected, (state, { isConnected }): FirebaseState => {
        return {
            ...state,
            isConnected,
        };
    }),
);
