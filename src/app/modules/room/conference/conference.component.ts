import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsLayoutModeFullScreen } from '@room/app/store';
import { selectIsDrawerOpen } from '@room/pl-drawers/store';
import { selectIsLocalParticipantHost, selectIsLocalParticipantObserver } from '../session/store';
import { Stream, selectConference, StreamLike } from './store';

@Component({
    selector: 'pl-conference',
    templateUrl: 'conference.component.html',
    styleUrls: ['conference.component.less'],
})

export class ConferenceComponent {
    public streams$: Observable<StreamLike[]>;
    public isHost$: Observable<boolean>;
    public isFullScreen$: Observable<boolean>;
    public isDrawerOpen$: Observable<boolean>;
    public isObserver$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
    ) {
        this.streams$ = this.store.select(selectConference);
        this.isHost$ = this.store.select(selectIsLocalParticipantHost);
        this.isFullScreen$ = this.store.select(selectIsLayoutModeFullScreen);
        this.isDrawerOpen$ = this.store.select(selectIsDrawerOpen);
        this.isObserver$ = this.store.select(selectIsLocalParticipantObserver);
    }

    trackByStreams(_: number, stream: Stream) {
        return stream.id;
    }
}
