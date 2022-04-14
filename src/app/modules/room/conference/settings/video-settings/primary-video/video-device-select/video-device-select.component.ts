import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DeviceInfo } from '@common/media/store';
import { VideoDeviceSelectService } from './video-device-select.service';

@Component({
    selector: 'pl-video-device-select',
    templateUrl: 'video-device-select.component.html',
    providers: [
        VideoDeviceSelectService,
    ],
})

export class VideoDeviceSelectComponent implements OnInit {
    private subscriptions: Subscription[] = [];

    public devices$: Observable<DeviceInfo[]>;
    public formControl = new FormControl();

    constructor(
        private videoDeviceSelectService: VideoDeviceSelectService,
    ) {
        this.devices$ = videoDeviceSelectService.devices$;
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
            this.videoDeviceSelectService.updateVideoDevice(deviceId);
        });
    }

    private setDefaultValue() {
        return this.videoDeviceSelectService.deviceId$.pipe(
            take(1),
        ).subscribe((deviceId) => {
            this.formControl.setValue(deviceId);
        });
    }
}
