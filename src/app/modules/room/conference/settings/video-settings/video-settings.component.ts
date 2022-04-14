import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoSettingsService } from './video-settings.service';

@Component({
    selector: 'pl-video-settings',
    templateUrl: 'video-settings.component.html',
    providers: [
        VideoSettingsService,
    ],
})

export class VideoSettingsComponent implements OnInit {
    public canShowSecondary$: Observable<boolean>;

    constructor(
        videoSettingsService: VideoSettingsService,
    ) {
        this.canShowSecondary$ = videoSettingsService.canShowSecondary$;
    }

    ngOnInit() {
    }
}
