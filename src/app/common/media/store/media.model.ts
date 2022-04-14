import { EntityState } from '@ngrx/entity';

export interface MediaStateExtras {
    status: 'loading' | 'success' | 'error';
    error?: any;
}

export type MediaState = EntityState<DeviceInfo> & MediaStateExtras;

export type DeviceType = 'audio' | 'video';
export type DeviceDirection = 'input' | 'output';
export interface DeviceInfo extends MediaDeviceInfo {
    type: DeviceType;
    direction: DeviceDirection;
}
