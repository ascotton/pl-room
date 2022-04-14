import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { teardown } from '@common/rxjs/operators';
import { DevicesService } from '@common/media';
import { ConferenceService } from '@room/conference/conference.service';
import { selectStreamVideoDevice, selectStreamIsLocal, selectStreamIsHidden } from '@room/conference/store';

@Injectable()
export class VideoSettingsContainerService {
    private currMediaStream: MediaStream;
    private idSubject = new BehaviorSubject<string | null>(null);

    public streamId$: Observable<string>;
    public mediaStream$: Observable<MediaStream>;

    constructor(
        private store: Store<AppState>,
        private conferenceService: ConferenceService,
        private devicesService: DevicesService,
    ) {
        this.streamId$ = this.idSubject.pipe(
            filter(id => !!id),
        );

        this.mediaStream$ = this.streamId$.pipe(
            switchMap(streamId => this.getMediaStream(streamId)),
        );
    }

    private getMediaStream(id: string): Observable<MediaStream> {
        return this.store.select(selectStreamIsLocal(id)).pipe(
            switchMap((isLocal) => {
                if (isLocal) {
                    return this.getLocalMediaStream(id);
                }

                return this.getRemoteMediaStream(id);
            }),
        );
    }
    private getLocalMediaStream(streamId: string) {
        return this.store.select(selectStreamVideoDevice(streamId)).pipe(
            switchMap(deviceId => this.devicesService.createMediaStream({ video: { deviceId } })),
            tap((newMediaStream) => {
                this.currMediaStream = newMediaStream;
            }),
            teardown(() => {
                this.stopCurrentMediaStream();
            }),
        );
    }

    private getRemoteMediaStream(streamId: string) {
        return this.store.select(selectStreamIsHidden(streamId)).pipe(
            switchMap((isHidden) => {
                if (isHidden) {
                    return of(null);
                }
                return this.conferenceService.getMediaStream(streamId);
            }),
        );
    }

    stopCurrentMediaStream() {
        if (this.currMediaStream) {
            this.devicesService.stopMediaStream(this.currMediaStream);
            this.currMediaStream = null;
        }
    }

    setId(id: string) {
        this.idSubject.next(id);
    }

    getId() {
        return this.idSubject.getValue();
    }
}
