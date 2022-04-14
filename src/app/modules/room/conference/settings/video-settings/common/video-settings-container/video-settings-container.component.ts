import { Component, OnInit, Input } from '@angular/core';
import { VideoSettingsContainerService } from './video-settings-container.service';

@Component({
    selector: 'pl-video-settings-container',
    template: '<ng-content></ng-content>',
    providers: [
        VideoSettingsContainerService,
    ],
})

export class VideoSettingsContainerComponent implements OnInit {
    @Input() streamId: string;

    constructor(
        private videoSettingsContainerService: VideoSettingsContainerService,
    ) {
    }

    ngOnInit() {
        this.videoSettingsContainerService.setId(this.streamId);
    }
}
