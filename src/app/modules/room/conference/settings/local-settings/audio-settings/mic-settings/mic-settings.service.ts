import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { DevicesService, MediaStreamPlayback } from '@common/media';
import { teardown } from '@common/rxjs/operators';
import { selectStreamMicDevice, ConferenceActions } from '@room/conference/store';
import { ConferenceService } from '@room/conference/conference.service';
import { StreamSettingsService } from '../../../stream-settings.service';
import { AudioSettingsService } from '../audio-settings.service';

@Injectable()
export class MicSettingsService {
    private currMediaStream: MediaStream;

    public micId$: Observable<string>;
    public micLevel$: Observable<number>;

    constructor(
        private conferenceService: ConferenceService,
        private streamSettingsService: StreamSettingsService,
        private audioSettingsService: AudioSettingsService,
        private store: Store<AppState>,
        private devicesService: DevicesService,
    ) {
        this.micId$ = this.audioSettingsService.streamId.pipe(
            switchMap(id => store.select(selectStreamMicDevice(id))),
        );

        this.micLevel$ = this.getMediaStream().pipe(
            switchMap(mediaStream => this.getMediaStreamAudioLevel(mediaStream)),
        );
    }

    updateMicDevice(deviceId: string) {
        this.stopCurrentMediaStream();
        this.store.dispatch(ConferenceActions.setMicDevice({
            participantId: this.streamSettingsService.getId(),
            micDevice: deviceId,
        }));
    }

    getMediaStream() {
        return this.audioSettingsService.streamId.pipe(
            switchMap((id) => {
                return this.conferenceService.getMediaStream(id).pipe(
                    map((mediaStream) => {
                        if (!mediaStream) {
                            return null;
                        }

                        const clone = mediaStream.clone();

                        this.devicesService.enableMediaStreamAudio(clone, true);

                        return clone;
                    }),
                    tap((mediaStream) => {
                        this.currMediaStream = mediaStream;
                    }),
                    teardown(() => {
                        this.stopCurrentMediaStream();
                    }),
                );
            }),
        );
    }

    private stopCurrentMediaStream() {
        if (this.currMediaStream) {
            this.devicesService.stopMediaStream(this.currMediaStream);
            this.currMediaStream = null;
        }
    }

    private getMediaStreamAudioLevel(mediaStream: MediaStream) {
        if (!mediaStream) {
            return of(0);
        }
        const playback = new MediaStreamPlayback(mediaStream, {
            frequencyDataLength: 1,
        });
        return playback.frequencyData$.pipe(
            map(fdata => this.audioSettingsService.frequencyToPercent(fdata)),
        );
    }
}
