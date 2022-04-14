import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { DeviceInfo } from '@common/media/store';
import { selectStreamVideoDevice, ConferenceActions, selectAvailableVideoDevices } from '@room/conference/store';
import { SecondaryVideoSettingsService } from '../secondary-video-settings.service';

@Injectable()
export class SecondaryVideoDeviceService {
    public deviceId$: Observable<string>;
    public devices$: Observable<DeviceInfo[]>;

    constructor(
        private store: Store<AppState>,
        secondaryVideoSettingsService: SecondaryVideoSettingsService,
    ) {
        this.devices$ = secondaryVideoSettingsService.streamId$.pipe(
            switchMap(id => store.select(selectAvailableVideoDevices(id))),
        );

        this.deviceId$ = secondaryVideoSettingsService.streamId$.pipe(
            switchMap(id => store.select(selectStreamVideoDevice(id))),
        );
    }

    addSecondary(deviceId: string) {
        this.store.dispatch(ConferenceActions.addLocalSecondary({
            videoDeviceId: deviceId,
        }));
    }

    removeSecondary() {
        this.store.dispatch(ConferenceActions.removeLocalSecondary());
    }

    updateVideoDevice(streamId: string, deviceId: string) {
        this.store.dispatch(ConferenceActions.setVideoDevice({
            id: streamId,
            videoDevice: deviceId,
        }));
    }
}
