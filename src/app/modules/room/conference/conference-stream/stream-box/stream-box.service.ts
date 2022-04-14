import { Observable, of, BehaviorSubject, interval, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap, map, distinctUntilChanged, takeWhile, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ConferenceService } from '@conference/conference.service';

import {
    ConferenceActions,
    selectStreamIsMirrored,
    selectStreamIsRotated,
    selectStreamIsHidden,
    selectStreamIsPromoted,
    selectCoverVideo,
    selectScreenshottingId,
    selectCapturingId,
    selectStreamIsLocal,
} from '@conference/store';
import { ConferenceStreamService } from '../conference-stream.service';

@Injectable()
export class StreamBoxService {
    private videoStartingSubject = new BehaviorSubject(false);

    public mediaStream$: Observable<MediaStream>;

    public id$: Observable<string>;
    public isRotated$: Observable<boolean>;
    public isMirrored$: Observable<boolean>;
    public isPromoted$: Observable<boolean>;
    public isCovered$: Observable<boolean>;
    public isScreenshotting$: Observable<boolean>;
    public isCapturing$: Observable<boolean>;
    public isAnyScreenshotting$: Observable<boolean>;
    isLocal$: Observable<any>;
    public isVideoStarting$: Observable<boolean>;
    nativeElement: any;

    constructor(
        private store: Store<AppState>,
        private conferenceService: ConferenceService,
        private conferenceStreamService: ConferenceStreamService,
    ) {
        const id$ = this.conferenceStreamService.streamId$;
        this.id$ = id$;

        this.isMirrored$ = id$.pipe(
            switchMap(id => this.store.select(selectStreamIsMirrored(id))),
        );

        this.isRotated$ = id$.pipe(
            switchMap(id => this.store.select(selectStreamIsRotated(id))),
        );

        this.mediaStream$ = id$.pipe(
            switchMap(id => this.getMediaStream(id)),
        );

        this.isPromoted$ = id$.pipe(
            switchMap(id => this.store.select(selectStreamIsPromoted(id))),
        );

        this.isCovered$ = conferenceStreamService.streamId$.pipe(
            switchMap(id => store.select(selectCoverVideo(id))),
        );

        const screenshottingId$ = this.store.select(selectScreenshottingId);
        this.isScreenshotting$ = combineLatest([
            id$,
            screenshottingId$,
        ]).pipe(
            map(
                ([id, ssId]) => id === ssId,
            ),
        );


        const capturingId$ = this.store.select(selectCapturingId);
        this.isCapturing$ = combineLatest([
            id$,
            capturingId$,
        ]).pipe(
            map(
                ([id, cId]) => id === cId,
            ),
        );

        this.isAnyScreenshotting$ = screenshottingId$.pipe(map(val => val !== null));

        this.isLocal$ = id$.pipe(
            switchMap(id => store.select(selectStreamIsLocal(id))),
        );
        this.isVideoStarting$ = this.videoStartingSubject.asObservable();
    }

    getVideoElement(): HTMLVideoElement {
        const videoElement: HTMLVideoElement = <HTMLVideoElement>this.nativeElement.querySelector('video');
        return videoElement;
    }

    stopScreenshotting() {
        this.store.dispatch(ConferenceActions.stopScreenshotting());
    }

    setVideoStarting(state: boolean) {
        this.videoStartingSubject.next(state);
    }

    private getMediaStream(id: string): Observable<MediaStream> {
        return this.store.select(selectStreamIsHidden(id)).pipe(
            switchMap((isHidden) => {
                if (isHidden) {
                    this.setVideoStarting(false);
                    return of(null);
                }
                this.setVideoStarting(true);
                return this.conferenceService.getMediaStream(id).pipe(
                    switchMap((mediaStream) => {
                        if (!mediaStream) {
                            return of(null);
                        }

                        const videoTrack = mediaStream.getVideoTracks()[0];
                        if (!videoTrack) {
                            return of(null);
                        }

                        // Sometimes mediaStream gets emitted but the enabled value is still false
                        // So we wait until video is enabled
                        if (!videoTrack.enabled) {
                            return interval(100).pipe(
                                map(() => videoTrack),
                                map(track => track.enabled ? track : null),
                                takeWhile(track => !track, true),
                            );
                        }

                        return of(videoTrack);
                    }),
                    distinctUntilChanged((x, y) => {
                        const isEqual = x === y;
                        if (isEqual) {
                            const xEnabled = x && x.enabled;
                            const yEnabled = y && y.enabled;
                            return xEnabled === yEnabled;
                        }

                        return isEqual;
                    }),
                    map(track => track ? new MediaStream([track]) : null),
                );
            }),
        );
    }
}
