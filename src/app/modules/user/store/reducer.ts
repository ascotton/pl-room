import { createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { initialState } from './state';
import { User } from '../user.model';
import { GuidService } from '@common/services/GuidService';

export const reducer = createReducer(
    initialState,
    on(UserActions.setId, (state, { id }) => {
        return {
            ...state,
            userId: id,
        };
    }),
    on(UserActions.set, (state, action) => {
        const { isAuthenticated, user } = action;
        const uiFlagsList = user.xEnabledUiFlags || [];
        const id = user.uuid || new GuidService().generateUUID();
        return {
            isAuthenticated,
            userId: id,
            user: {
                ...user,
                uuid: id,
                display_name: getDisplayName(user),
                groups: [...user.groups],
                admissionInfo: {
                    ...state.user.admissionInfo,
                    ...user.admissionInfo,
                },
            },
            uiFlags: uiFlagsList.reduce(
                (acu, next) => {
                    acu[next] = true;
                    return acu;
                },
                {},
            ),
        };
    }),
    on(UserActions.remove, () => {
        return {
            ...initialState,
        };
    }),
    on(UserActions.startAdmission, (state, action) => {
        return {
            ...state,
            user: {
                ...state.user,
                admissionInfo: {
                    browserId: action.browserId,
                },
            },
        };
    }),
    on(UserActions.waitAdmission, (state) => {
        return {
            ...state,
            user: {
                ...state.user,
                admissionInfo: {
                    ...state.user.admissionInfo,
                    waitingId: state.user.admissionInfo.browserId,
                },
            },
        };
    }),
    on(UserActions.setAdmitted, (state, { joinMuted, token }) => {
        return {
            ...state,
            user: {
                ...state.user,
                admissionInfo: {
                    ...state.user.admissionInfo,
                    token,
                    joinMuted: !!joinMuted,
                },
            },
        };
    }),
);

function getDisplayName(user: User) {
    if (user.display_name) {
        return user.display_name;
    }

    let result = 'Unkown';

    if (user.first_name) {
        result = user.first_name;
    }

    if (user.last_name) {
        result += ` ${user.last_name}`;
    }

    return result;
}
