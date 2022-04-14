import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface MediaStreamDevices {
    audio?: string;
    video?: string;
}

@Injectable({ providedIn: 'root' })
export class DevicesService {

    constructor() {}

    requestPermissions(constraints?: MediaStreamConstraints) {
        return this.createMediaStream(constraints).pipe(
            switchMap((mediaStream) => {
                this.stopMediaStream(mediaStream);
                return of(true);
            }),
        );
    }

    onDeviceChange() {
        return new Observable<Event>((subscriber) => {
            const handler = (ev: Event) => subscriber.next(ev);
            navigator.mediaDevices.addEventListener(
                'devicechange',
                handler,
            );

            subscriber.add(() => {
                navigator.mediaDevices.removeEventListener(
                    'devicechange',
                    handler,
                );
            });
        });
    }

    listDevices() {
        return from(navigator.mediaDevices.enumerateDevices()).pipe(
            map(devices => devices.filter(d => this.isValidDevice(d))),
        );
    }

    createMediaStream(constraints?: MediaStreamConstraints) {
        return from(navigator.mediaDevices.getUserMedia(constraints));
    }

    enableMediaStreamAudio(mediaStream: MediaStream, enabled: boolean) {
        for (const track of mediaStream.getAudioTracks()) {
            track.enabled = enabled;
        }
    }

    enableMediaStreamVideo(mediaStream: MediaStream, enabled: boolean) {
        for (const track of mediaStream.getVideoTracks()) {
            track.enabled = enabled;
        }
    }

    stopMediaStream(mediaStream: MediaStream) {
        for (const track of mediaStream.getTracks()) {
            track.stop();
        }
    }

    getMediaStreamDevices(mediaStream: MediaStream): MediaStreamDevices {
        return {
            audio: this.getDeviceFromTracks(mediaStream.getAudioTracks()),
            video: this.getDeviceFromTracks(mediaStream.getVideoTracks()),
        };
    }

    private isValidDevice(device: MediaDeviceInfo) {
        return device.deviceId && device.deviceId !== 'communications';
    }

    private getDeviceFromTracks(tracks: MediaStreamTrack[]): string {
        const hasTracks = tracks && tracks.length;
        if (!hasTracks) {
            return;
        }

        const track = tracks[0];
        const { deviceId } = track.getSettings();

        return deviceId;
    }
}
