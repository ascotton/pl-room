import { createAction } from '@common/utils';
import { props } from '@ngrx/store';
import { DeviceInfo } from './media.model';

export enum MediaActionTypes {
    init = '/media/init',
    devicesChanged = '/media/devicesChanged',
    refresh = '/media/refresh',
    refreshSuccess = '/media/refreshSuccess',
    refreshError = '/media/refreshError',
}

const init = createAction(
    MediaActionTypes.init,
);

const devicesChanged = createAction(
    MediaActionTypes.devicesChanged,
);

const refresh = createAction(
    MediaActionTypes.refresh,
);

const refreshSuccess = createAction(
    MediaActionTypes.refreshSuccess,
    props<{ devices: DeviceInfo[] }>(),
);

const refreshError = createAction(
    MediaActionTypes.refreshError,
    props<{ error: any }>(),
);

export const MediaActions = {
    init,
    devicesChanged,
    refresh,
    refreshSuccess,
    refreshError,
};
