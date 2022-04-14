import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ConferenceActions } from '@conference/store';
import { ConferenceStreamService } from '@conference/conference-stream/conference-stream.service';
import { StreamBoxService } from '@conference/conference-stream/stream-box/stream-box.service';
import { VideoCaptureService } from '@modules/room/pl-video-capture';

@Injectable()
export class StreamScreenshotService {
    isScreenshotting$: Observable<boolean>;
    isCapturing$: Observable<boolean>;

    showButton$: Observable<boolean>;
    capturing: boolean;

    constructor(
        private conferenceStreamService: ConferenceStreamService,
        private streamBoxService: StreamBoxService,
        private store: Store<AppState>,
        private videoCaptureService: VideoCaptureService,
    ) {
        const isAnyScreenshotting$ = streamBoxService.isAnyScreenshotting$;

        this.isScreenshotting$ = streamBoxService.isScreenshotting$;
        this.isCapturing$ = streamBoxService.isCapturing$;

        this.showButton$ = combineLatest([
            isAnyScreenshotting$,
            this.isScreenshotting$,
        ]).pipe(
            map(
                ([isAnyScreenshotting, isScreenshotting]) => {
                    return !isAnyScreenshotting || isScreenshotting;
                },
            ),
        );

    }

    startScreenshotting() {
        this.store.dispatch(ConferenceActions.startScreenshotting({
            id: this.conferenceStreamService.getId(),
        }));
    }

    stopScreenshotting() {
        this.streamBoxService.stopScreenshotting();
    }

    stopCapturing() {
        this.store.dispatch(ConferenceActions.stopCapturing());
    }

    capture() {
        this.store.dispatch(ConferenceActions.startCapturing({
            id: this.conferenceStreamService.getId(),
        }));
        this.capturing = true;
        const videoElement: HTMLVideoElement = this.streamBoxService.getVideoElement();
        const id = this.conferenceStreamService.getId();
        this.videoCaptureService.startCapture(videoElement, id).subscribe(
            () => {
                this.capturing = false;
            }
        );
    }

}
