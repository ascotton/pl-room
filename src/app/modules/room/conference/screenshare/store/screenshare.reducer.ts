import { createReducer, on } from '@ngrx/store';
import { ScreenshareState, ScreenshareStatus } from './screenshare.model';
import { ScreenshareActions } from './screenshare.actions';

export const initialState: ScreenshareState = {
    status: ScreenshareStatus.idle,
};

export const reducer = createReducer(
    initialState,
    on(
        ScreenshareActions.start,
        () => {
            return {
                status: ScreenshareStatus.loading,
                error: null,
            };
        },
    ),
    on(
        ScreenshareActions.startedRemotely,
        ScreenshareActions.startSuccess,
        () => {
            return {
                status: ScreenshareStatus.sharing,
                error: null,
            };
        },
    ),
    on(
        ScreenshareActions.startError,
        (_, action) => {
            return {
                status: ScreenshareStatus.error,
                error: action.error,
            };
        },
    ),
    on(
        ScreenshareActions.stoppedRemotely,
        ScreenshareActions.stop,
        () => {
            return {
                status: ScreenshareStatus.idle,
                error: null,
            };
        },
    ),
);
