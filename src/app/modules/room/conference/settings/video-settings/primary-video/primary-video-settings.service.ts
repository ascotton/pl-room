import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsLocalParticipantHost } from '@room/session/store';
import { selectParticipantPrimaryStreamId, selectStreamIsLocal, selectCanCoverVideo } from '@room/conference/store';
import { StreamSettingsService } from '../../stream-settings.service';

@Injectable()
export class PrimaryVideoSettingsService {
    public streamId$: Observable<string>;
    public isLocal$: Observable<boolean>;
    public isHost$: Observable<boolean>;
    public canCoverVideo$: Observable<boolean>;

    constructor(
        store: Store<AppState>,
        streamSettingsService: StreamSettingsService,
    ) {
        this.streamId$ = streamSettingsService.participantId$.pipe(
            switchMap(id => store.select(selectParticipantPrimaryStreamId(id))),
        );

        this.isHost$ = store.select(selectIsLocalParticipantHost);

        this.isLocal$ = this.streamId$.pipe(
            switchMap(id => store.select(selectStreamIsLocal(id))),
        );

        this.canCoverVideo$ = this.streamId$.pipe(
            switchMap(id => store.select(selectCanCoverVideo(id))),
        );
    }

}
