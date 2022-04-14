import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectStreamVideoDevice, ConferenceActions, selectAvailableVideoDevices } from '@room/conference/store';
import { VideoSettingsContainerService } from '../../common';
import { DeviceInfo } from '@common/media/store';

@Injectable()
export class VideoDeviceSelectService {
    public deviceId$: Observable<string>;
    public devices$: Observable<DeviceInfo[]>;

    constructor(
        private store: Store<AppState>,
        private videoSettingsService: VideoSettingsContainerService,
    ) {
        this.devices$ = videoSettingsService.streamId$.pipe(
            switchMap(id => store.select(selectAvailableVideoDevices(id))),
        );

        this.deviceId$ = videoSettingsService.streamId$.pipe(
            switchMap(id => store.select(selectStreamVideoDevice(id))),
        );
    }

    updateVideoDevice(deviceId: string) {
        this.videoSettingsService.stopCurrentMediaStream();
        this.store.dispatch(ConferenceActions.setVideoDevice({
            id: this.videoSettingsService.getId(),
            videoDevice: deviceId,
        }));
    }
}
