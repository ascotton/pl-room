import { createAction } from '@common/utils';
import { props } from '@ngrx/store';

export enum ScreenshareActionTypes {
    start = '/screenshare/start',
    startSuccess = '/screenshare/startSuccess',
    startError = '/screenshare/startError',
    stop = '/screenshare/stop',
    startedRemotely = '/screenshare/startedRemotely',
    stoppedRemotely = '/screenshare/stoppedRemotely',
}

const start = createAction(
    ScreenshareActionTypes.start,
);

const startSuccess = createAction(
    ScreenshareActionTypes.startSuccess,
);

const startError = createAction(
    ScreenshareActionTypes.startError,
    props<{ error: any }>(),
);

const stop = createAction(
    ScreenshareActionTypes.stop,
);

const startedRemotely = createAction(
    ScreenshareActionTypes.startedRemotely,
);

const stoppedRemotely = createAction(
    ScreenshareActionTypes.stoppedRemotely,
);

export const ScreenshareActions = {
    start,
    startSuccess,
    startError,
    stop,
    startedRemotely,
    stoppedRemotely,
};
