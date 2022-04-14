import { createAction, props } from '@ngrx/store';
import { Room } from './room.model';

const setLoading = createAction('/room/setLoading');

const setSuccess = createAction('/room/setSuccess', props<{ data: Room }>());

const setError = createAction('/room/setError', props<{ error: any }>());

export const RoomActions = {
    setLoading,
    setSuccess,
    setError,
};
