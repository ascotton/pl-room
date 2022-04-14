import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsLocalParticipantHost } from '@room/session/store';
import { ConferenceActions, StreamType, selectStreamType, selectStreamCanMute } from '@room/conference/store';
import { ConferenceStreamService } from '../conference-stream.service';

@Injectable()
export class LocalStreamService {
    public participantId$: Observable<string>;
    public canMute$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
        private conferenceStreamService: ConferenceStreamService,
    ) {
        this.canMute$ = this.conferenceStreamService.streamId$.pipe(
            switchMap(id => this.store.select(selectStreamCanMute(id))),
        );

        this.participantId$ = this.conferenceStreamService.participantId$;
    }

    join() {
        this.store.dispatch(ConferenceActions.join({
            id: this.conferenceStreamService.getId(),
        }));
    }

    leave() {
        this.store.dispatch(ConferenceActions.leave({
            id: this.conferenceStreamService.getId(),
        }));
    }
}
