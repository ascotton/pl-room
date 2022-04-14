import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsVideoBoxService } from './settings-video-box.service';

@Component({
    selector: 'pl-settings-video-box',
    templateUrl: 'settings-video-box.component.html',
    styleUrls: ['settings-video-box.component.less'],
    providers: [
        SettingsVideoBoxService,
    ],
})

export class SettingsVideoBoxComponent implements OnInit {
    public mediaStream$: Observable<MediaStream>;

    public isRotated$: Observable<boolean>;
    public isMirrored$: Observable<boolean>;

    constructor(
        private settingsVideoBoxService: SettingsVideoBoxService,
    ) {
        this.mediaStream$ = this.settingsVideoBoxService.mediaStream$;
        this.isRotated$ = this.settingsVideoBoxService.isRotated$;
        this.isMirrored$ = this.settingsVideoBoxService.isMirrored$;
    }

    ngOnInit() { }
}
