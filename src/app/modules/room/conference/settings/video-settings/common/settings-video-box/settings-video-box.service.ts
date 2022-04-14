import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectStreamIsMirrored, selectStreamIsRotated } from '@room/conference/store';
import { VideoSettingsContainerService } from '../video-settings-container/video-settings-container.service';

@Injectable()
export class SettingsVideoBoxService {
    public mediaStream$: Observable<MediaStream>;

    public isRotated$: Observable<boolean>;
    public isMirrored$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
        private videoSettingsContainerService: VideoSettingsContainerService,
    ) {
        const id$ = this.videoSettingsContainerService.streamId$;

        this.mediaStream$ = this.videoSettingsContainerService.mediaStream$;

        this.isMirrored$ = id$.pipe(
            switchMap(id => this.store.select(selectStreamIsMirrored(id))),
        );

        this.isRotated$ = id$.pipe(
            switchMap(id => this.store.select(selectStreamIsRotated(id))),
        );
    }
}
