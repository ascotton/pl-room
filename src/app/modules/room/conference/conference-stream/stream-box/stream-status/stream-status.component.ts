import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsParticipantOffline, selectGuestIsNotViewingPage, selectShowVideoStates } from '@room/session/store';
import { selectStreamIsHidden, selectIsStreamConnecting, selectIsStreamDisconnected } from '@room/conference/store';
import { ConferenceStreamService } from '../../conference-stream.service';
import { StreamBoxService } from '../stream-box.service';

@Component({
    selector: 'pl-stream-status',
    templateUrl: 'stream-status.component.html',
    styleUrls: ['stream-status.component.less'],
})

export class StreamStatusComponent implements OnInit {
    isHidden$: Observable<boolean>;
    isVideoStarting$: Observable<boolean>;

    isOffline$: Observable<boolean>;
    isConferenceConnecting$: Observable<boolean>;
    isConferenceDisconnected$: Observable<boolean>;
    isNotViewingPage$: Observable<boolean>;

    showNotHiddenStates$: Observable<boolean>;

    constructor(
        store: Store<AppState>,
        conferenceStreamService: ConferenceStreamService,
        streamBoxService: StreamBoxService,
    ) {
        this.isHidden$ = conferenceStreamService.streamId$.pipe(
            switchMap(id => store.select(selectStreamIsHidden(id))),
        );

        this.isVideoStarting$ = streamBoxService.isVideoStarting$;

        this.isOffline$ = conferenceStreamService.participantId$.pipe(
            switchMap(id => store.select(selectIsParticipantOffline(id))),
        );

        this.isConferenceConnecting$ = conferenceStreamService.streamId$.pipe(
            switchMap(id => store.select(selectIsStreamConnecting(id))),
        );

        this.isConferenceDisconnected$ = conferenceStreamService.streamId$.pipe(
            switchMap(id => store.select(selectIsStreamDisconnected(id))),
        );

        this.isNotViewingPage$ = conferenceStreamService.participantId$.pipe(
            switchMap(id => store.select(selectGuestIsNotViewingPage(id))),
        );

        const showVideoStates$ = conferenceStreamService.participantId$.pipe(
            switchMap(id => store.select(selectShowVideoStates(id))),
        );

        this.showNotHiddenStates$ = combineLatest([
            showVideoStates$,
            this.isOffline$,
            this.isConferenceConnecting$,
            this.isNotViewingPage$,
            this.isConferenceDisconnected$,
        ]).pipe(
            map(([showVideoStates, ...states]) => {
                return showVideoStates && states.some(Boolean);
            }),
            distinctUntilChanged(),
        );
    }

    ngOnInit() { }
}
