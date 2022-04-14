import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { distinctUntilChanged, take, switchMap, withLatestFrom, map } from 'rxjs/operators';
import { DeviceInfo } from '@common/media/store';
import { SecondaryVideoSettingsService } from '../secondary-video-settings.service';
import { SecondaryVideoDeviceService } from './secondary-video-device.service';

@Component({
    selector: 'pl-secondary-video-device',
    templateUrl: 'secondary-video-device.component.html',
    providers: [
        SecondaryVideoDeviceService,
    ],
})

export class SecondaryVideoDeviceComponent implements OnInit {
    private subscriptions: Subscription[] = [];

    private streamId$: Observable<string | null>;

    public devices$: Observable<DeviceInfo[]>;
    public showNoneOption$: Observable<boolean>;
    public formControl = new FormControl();

    constructor(
        private secondaryVideoDeviceService: SecondaryVideoDeviceService,
        secondaryVideoSettingsService: SecondaryVideoSettingsService,
    ) {
        this.devices$ = secondaryVideoDeviceService.devices$;
        this.streamId$ = secondaryVideoSettingsService.streamId$;
        this.showNoneOption$ = secondaryVideoDeviceService.deviceId$.pipe(
            map(deviceId => Boolean(deviceId)),
        );
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
            switchMap((val) => {
                return of(val).pipe(
                    withLatestFrom(this.streamId$),
                );
            }),
        ).subscribe(([deviceId, streamId]) => {
            if (!deviceId) {
                this.secondaryVideoDeviceService.removeSecondary();
            } else {
                if (!streamId) {
                    this.secondaryVideoDeviceService.addSecondary(deviceId);
                } else {
                    this.secondaryVideoDeviceService.updateVideoDevice(streamId, deviceId);
                }
            }
        });
    }

    private setDefaultValue() {
        return this.secondaryVideoDeviceService.deviceId$.pipe(
            take(1),
        ).subscribe((deviceId) => {
            this.formControl.setValue(deviceId);
        });
    }
}
