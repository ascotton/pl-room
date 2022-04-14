import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AppState } from '@app/store';
import { DeviceInfo, selectAudioDevices } from '@common/media/store';
import { MicSettingsService } from '../mic-settings/mic-settings.service';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, take } from 'rxjs/operators';

@Component({
    selector: 'pl-audio-device',
    templateUrl: 'audio-device.component.html',
})

export class AudioDeviceComponent implements OnInit {
    private subscriptions: Subscription[] = [];

    public devices$: Observable<DeviceInfo[]>;
    public formControl = new FormControl();

    constructor(
        store: Store<AppState>,
        private micSettingsService: MicSettingsService,
    ) {
        this.devices$ = store.select(selectAudioDevices);
    }

    ngOnInit() {
        this.subscriptions.push(
            this.setDefaultValue(),
            this.onValueChanged(),
        );
    }

    private onValueChanged() {
        return this.formControl.valueChanges.pipe(
            distinctUntilChanged(),
        ).subscribe((deviceId) => {
            this.micSettingsService.updateMicDevice(deviceId);
        });
    }

    private setDefaultValue() {
        return this.micSettingsService.micId$.pipe(
            take(1),
        ).subscribe((deviceId) => {
            this.formControl.setValue(deviceId);
        });
    }
}
