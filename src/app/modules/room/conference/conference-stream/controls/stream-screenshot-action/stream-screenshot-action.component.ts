import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamScreenshotService } from './stream-screenshot.service';

@Component({
    selector: 'pl-stream-screenshot-action',
    templateUrl: 'stream-screenshot-action.component.html',
    providers: [
        StreamScreenshotService,
    ],
})

export class StreamScreenshotActionComponent implements OnInit {

    public isScreenshotting$: Observable<boolean>;
    public canScreenshot$: Observable<boolean>;
    showScreenshotButton$: Observable<boolean>;
    showButton$: Observable<boolean>;
    isCapturing$: Observable<boolean>;

    constructor(
        private streamScreenshotService: StreamScreenshotService,
    ) {
        this.showButton$ = this.streamScreenshotService.showButton$;
        this.isScreenshotting$ = this.streamScreenshotService.isScreenshotting$;
        this.isCapturing$ = this.streamScreenshotService.isCapturing$;
    }

    ngOnInit() { }

    startScreenshotting() {
        this.streamScreenshotService.startScreenshotting();
    }

    capture() {
        this.streamScreenshotService.capture();
    }
}
