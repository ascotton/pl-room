import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamBoxService } from '../stream-box.service';

@Component({
    selector: 'pl-stream-video-box',
    templateUrl: 'stream-video-box.component.html',
    styleUrls: ['stream-video-box.component.less'],
})

export class StreamVideoBoxComponent implements OnInit {

    public mediaStream$: Observable<MediaStream>;
    public isMuted$: Observable<boolean>;
    public isMirrored$: Observable<boolean>;
    public isRotated$: Observable<boolean>;
    public isCovered$: Observable<boolean>;
    public id$: Observable<string>;
    isScreenshotting$: Observable<boolean>;

    constructor(
        private streamBoxService: StreamBoxService,
        private element: ElementRef,
    ) {
        this.mediaStream$ = streamBoxService.mediaStream$;
        this.isMirrored$ = streamBoxService.isMirrored$;
        this.isRotated$ = streamBoxService.isRotated$;
        this.isCovered$ = streamBoxService.isCovered$;
        this.id$ = streamBoxService.id$;
        this.isScreenshotting$ = streamBoxService.isScreenshotting$;

        this.streamBoxService.nativeElement = this.element.nativeElement;
    }

    ngOnInit() { }

    videoCaptureComplete() {
        this.streamBoxService.stopScreenshotting();
    }

    onPlayed() {
        this.streamBoxService.setVideoStarting(false);
    }
}
