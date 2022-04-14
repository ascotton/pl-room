import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectStreamIsRotated, ConferenceActions } from '@room/conference/store';
import { VideoSettingsContainerService } from '../video-settings-container/video-settings-container.service';

@Injectable()
export class RotateVideoService {
    public isRotated$: Observable<boolean>;

    constructor(
        private videoSettingsContainerService: VideoSettingsContainerService,
        private store: Store<AppState>,
    ) {
        this.isRotated$ = videoSettingsContainerService.streamId$.pipe(
            switchMap(id => store.select(selectStreamIsRotated(id))),
        );
    }

    rotate() {
        this.store.dispatch(ConferenceActions.rotate({
            id: this.videoSettingsContainerService.getId(),
        }));
    }

    derotate() {
        this.store.dispatch(ConferenceActions.derotate({
            id: this.videoSettingsContainerService.getId(),
        }));
    }
}
