import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ConferenceStreamService } from '../conference-stream.service';
import { selectIsParticipantOffline, selectIsLocalParticipantHost } from '../../../session/store';
import { selectStreamCanScreenshot, selectStreamCanMute } from '../../store';

@Injectable()
export class RemoteStreamService {
    public canDismiss$: Observable<boolean>;
    public canMute$: Observable<boolean>;
    public canShowSettings$: Observable<boolean>;
    public participantId$: Observable<string>;
    public canShowScreenshot$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
        private conferenceStreamService: ConferenceStreamService,
    ) {
        const isOffline$ = conferenceStreamService.participantId$.pipe(
            switchMap(id => store.select(selectIsParticipantOffline(id))),
        );

        const canMute$ = this.conferenceStreamService.streamId$.pipe(
            switchMap(id => this.store.select(selectStreamCanMute(id))),
        );

        this.canShowSettings$ = combineLatest([
            isOffline$,
            this.store.select(selectIsLocalParticipantHost),
        ]).pipe(
            map(([isOffline, isLocalHost]) => !isOffline && isLocalHost),
            distinctUntilChanged(),
        );

        this.canMute$ = combineLatest([
            isOffline$,
            canMute$,
        ]).pipe(
            map(([isOffline, canMute]) => !isOffline && canMute),
            distinctUntilChanged(),
        );

        this.canDismiss$ = this.store.select(selectIsLocalParticipantHost);
        this.participantId$ = this.conferenceStreamService.participantId$;
        this.canShowScreenshot$ = conferenceStreamService.streamId$.pipe(
            switchMap(id => store.select(selectStreamCanScreenshot(id))),
        );
    }
}
