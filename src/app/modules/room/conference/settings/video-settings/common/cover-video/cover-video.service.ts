import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectStreamIsCovered, ConferenceActions } from '@room/conference/store';
import { VideoSettingsContainerService } from '../video-settings-container/video-settings-container.service';

@Injectable()
export class CoverVideoService {

    isCovered$: Observable<boolean>;

    constructor(
        private videoSettingsContainerService: VideoSettingsContainerService,
        private store: Store<AppState>,
    ) {
        this.isCovered$ = this.videoSettingsContainerService.streamId$.pipe(
            switchMap(id => this.store.select(selectStreamIsCovered(id))),
        );
    }

    cover() {
        this.store.dispatch(ConferenceActions.cover({
            id: this.videoSettingsContainerService.getId(),
        }));
    }

    uncover() {
        this.store.dispatch(ConferenceActions.uncover({
            id: this.videoSettingsContainerService.getId(),
        }));
    }
}
