import { createReducer, on } from '@ngrx/store';
import { RoomState } from './room.model';
import { RoomActions } from './room.actions';

const initialState: RoomState = {
    status: 'loading',
};

export const reducer = createReducer(
    initialState,
    on(RoomActions.setLoading, () => {
        return {
            status: 'loading',
        };
    }),
    on(RoomActions.setSuccess, (_, { data }) => {
        return {
            data,
            status: 'success',
        };
    }),
    on(RoomActions.setError, (_, { error }) => {
        return {
            error,
            status: 'loading',
        };
    }),
);
