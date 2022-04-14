import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectStreamDisplayName, ConferenceActions } from '@room/conference/store';
import { VideoSettingsContainerService } from '../video-settings-container/video-settings-container.service';

@Injectable()
export class VideoLabelService {
    displayName$: Observable<string>;

    constructor(
        private videoSettingsContainerService: VideoSettingsContainerService,
        private store: Store<AppState>,
    ) {
        this.displayName$ = videoSettingsContainerService.streamId$.pipe(
            switchMap(id => store.select(selectStreamDisplayName(id))),
        );
    }

    setDisplayName(displayName: string) {
        this.store.dispatch(ConferenceActions.setDisplayName({
            displayName,
            id: this.videoSettingsContainerService.getId(),
        }));
    }
}
