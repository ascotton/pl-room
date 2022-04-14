import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsLocalParticipantHost, selectParticipantIsLocal } from '@room/session/store';
import { selectParticipantSecondaryStreamId, selectIsAvailableVideoDevicesEmpty, selectCanCoverVideo } from '@room/conference/store';
import { StreamSettingsService } from '../../stream-settings.service';

@Injectable()
export class SecondaryVideoSettingsService {
    public streamId$: Observable<string | null>;
    public isParticipantLocal$: Observable<boolean>;
    public isHost$: Observable<boolean>;
    public shouldRequestPermissions$: Observable<boolean>;
    public canCoverVideo$: Observable<boolean>;

    constructor(
        store: Store<AppState>,
        streamSettingsService: StreamSettingsService,
    ) {
        this.streamId$ = streamSettingsService.participantId$.pipe(
            switchMap(id => store.select(selectParticipantSecondaryStreamId(id))),
        );

        this.isHost$ = store.select(selectIsLocalParticipantHost);

        this.isParticipantLocal$ = streamSettingsService.participantId$.pipe(
            switchMap(id => store.select(selectParticipantIsLocal(id))),
        );

        this.shouldRequestPermissions$ = this.streamId$.pipe(
            switchMap(id => store.select(selectIsAvailableVideoDevicesEmpty(id))),
        );

        this.canCoverVideo$ = this.streamId$.pipe(
            switchMap(id => store.select(selectCanCoverVideo(id))),
        );
    }
}
