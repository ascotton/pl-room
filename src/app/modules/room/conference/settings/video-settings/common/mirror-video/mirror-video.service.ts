import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectStreamIsMirrored, ConferenceActions } from '@room/conference/store';
import { VideoSettingsContainerService } from '../video-settings-container/video-settings-container.service';

@Injectable()
export class MirrorVideoService {

    isMirrored$: Observable<boolean>;

    constructor(
        private videoSettingsContainerService: VideoSettingsContainerService,
        private store: Store<AppState>,
    ) {
        this.isMirrored$ = this.videoSettingsContainerService.streamId$.pipe(
            switchMap(id => this.store.select(selectStreamIsMirrored(id))),
        );
    }

    mirror() {
        this.store.dispatch(ConferenceActions.mirror({
            id: this.videoSettingsContainerService.getId(),
        }));
    }

    unmirror() {
        this.store.dispatch(ConferenceActions.unmirror({
            id: this.videoSettingsContainerService.getId(),
        }));
    }
}
