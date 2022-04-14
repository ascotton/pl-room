import { props } from '@ngrx/store';
import { User } from '../user.model';
import { createAction } from '@common/utils';

export interface UserSetPayload {
    isAuthenticated: boolean;
    user: User;
}
export interface UserStartAdmission {
    browserId: string;
}
export interface UserSetAdmitted {
    token: string;
    joinMuted?: boolean;
}

const setId = createAction('/auth/setId', props<{ id: string }>());
const set = createAction('/auth/set', props<UserSetPayload>());
const remove = createAction('/auth/remove');
const startAdmission = createAction('/auth/startAdmission', props<UserStartAdmission>());
const waitAdmission = createAction('/auth/waitAdmission');
const setAdmitted = createAction('/auth/setAdmitted', props<UserSetAdmitted>());

export const UserActions = {
    set,
    setId,
    remove,
    startAdmission,
    waitAdmission,
    setAdmitted,
};
