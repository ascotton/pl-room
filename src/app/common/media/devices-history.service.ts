import { Injectable } from '@angular/core';
import { DeviceType } from './store';

const STORAGE_KEY = 'devices';

@Injectable({ providedIn: 'root' })
export class DevicesHistoryService {
    constructor() { }

    getVideoDeviceId(name: string) {
        return this.getDeviceId('video', name);
    }

    setVideoDeviceId(name: string, id: string) {
        this.setDeviceId('video', name, id);
    }

    removeVideoDeviceId(name: string) {
        this.removeDeviceId('video', name);
    }

    getAudioDeviceId(name: string) {
        return this.getDeviceId('audio', name);
    }

    setAudioDeviceId(name: string, id: string) {
        this.setDeviceId('audio', name, id);
    }

    removeAudioDeviceId(name: string) {
        this.removeDeviceId('audio', name);
    }

    private getDeviceId(type: DeviceType, name: string) {
        const key = this.getKey(type, name);
        return localStorage.getItem(key);
    }

    private setDeviceId(type: DeviceType, name: string, id: string) {
        const key = this.getKey(type, name);
        localStorage.setItem(key, id);
    }

    private removeDeviceId(type: DeviceType, name: string) {
        const key = this.getKey(type, name);
        localStorage.removeItem(key);
    }

    private getKey(type: DeviceType, name: string) {
        return `${STORAGE_KEY}.${type}.${name}`;
    }
}
