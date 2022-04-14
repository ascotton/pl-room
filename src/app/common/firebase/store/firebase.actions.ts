import { createAction, props } from '@ngrx/store';
import { FirebaseConfig } from '../firebase.service';

const initialize = createAction(
    '/firebase/initialize',
    props<{ config: FirebaseConfig }>(),
);
const setInitialized = createAction('/firebase/setInitialized');
const setIsConnected = createAction(
    '/firebase/setIsConnected',
    props<{ isConnected: boolean }>(),
);

export const FirebaseActions = {
    initialize,
    setInitialized,
    setIsConnected,
};
