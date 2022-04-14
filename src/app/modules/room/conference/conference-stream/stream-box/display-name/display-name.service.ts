import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsGuestClickMuted, selectStreamIsCovered, selectStreamVideoLabel, selectStreamIsMuted } from '@room/conference/store';
import { ConferenceStreamService } from '../../conference-stream.service';

@Injectable()
export class StreamDisplayNameService {
    public displayName$: Observable<string>;
    public isMuted$: Observable<boolean>;
    public isGuestClickMuted$: Observable<boolean>;
    public isCovered$: Observable<boolean>;

    constructor(
        store: Store<AppState>,
        conferenceStreamService: ConferenceStreamService,
    ) {
        this.displayName$ = conferenceStreamService.streamId$.pipe(
            switchMap(id => store.select(selectStreamVideoLabel(id))),
        );

        this.isMuted$ = conferenceStreamService.streamId$.pipe(
            switchMap(streamId => store.select(selectStreamIsMuted(streamId))),
        );

        this.isGuestClickMuted$ = conferenceStreamService.participantId$.pipe(
            switchMap(participantId => store.select(selectIsGuestClickMuted(participantId))),
        );

        this.isCovered$ = conferenceStreamService.streamId$.pipe(
            switchMap(id => store.select(selectStreamIsCovered(id))),
        );
    }
}
