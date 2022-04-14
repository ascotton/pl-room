import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectStreamIsMuted, ConferenceActions, selectIsRTAndConferenceConnected } from '@room/conference/store';
import { ConferenceStreamService } from '../../conference-stream.service';

@Injectable()
export class StreamMicService {
    isMuted$: Observable<boolean>;
    preventMute$: Observable<boolean>;

    constructor(
        private conferenceStreamService: ConferenceStreamService,
        private store: Store<AppState>,
    ) {
        const id$ = conferenceStreamService.streamId$;

        this.isMuted$ = id$.pipe(
            switchMap(id => store.select(selectStreamIsMuted(id))),
        );

        this.preventMute$ = store.select(selectIsRTAndConferenceConnected).pipe(
            map(connected => !connected),
        );
    }

    mute() {
        this.store.dispatch(ConferenceActions.mute({
            id: this.conferenceStreamService.getId(),
        }));
    }

    unmute() {
        this.store.dispatch(ConferenceActions.unmute({
            id: this.conferenceStreamService.getId(),
        }));
    }
}
