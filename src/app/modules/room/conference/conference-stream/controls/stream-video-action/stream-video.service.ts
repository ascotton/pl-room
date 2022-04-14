import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ConferenceActions, selectStreamIsHidden, selectIsRTAndConferenceConnected } from '@room/conference/store';
import { ConferenceStreamService } from '../../conference-stream.service';

@Injectable()
export class StreamVideoService {
    isHidden$: Observable<boolean>;
    preventHide$: Observable<boolean>;

    constructor(
        private conferenceStreamService: ConferenceStreamService,
        private store: Store<AppState>,
    ) {
        const id$ = conferenceStreamService.streamId$;

        this.isHidden$ = id$.pipe(
            switchMap(id => store.select(selectStreamIsHidden(id))),
        );

        this.preventHide$ = store.select(selectIsRTAndConferenceConnected).pipe(
            map(connected => !connected),
        );
    }

    show() {
        this.store.dispatch(ConferenceActions.show({
            id: this.conferenceStreamService.getId(),
        }));
    }

    hide() {
        this.store.dispatch(ConferenceActions.hide({
            id: this.conferenceStreamService.getId(),
        }));
    }
}
