import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectParticipantIsLocal } from '@room/session/store';
import { selectSettingsStreams } from '../store';
import { MediaActions } from '@root/src/app/common/media/store';

@Injectable()
export class StreamSettingsService {
    private idSubject = new BehaviorSubject<string | null>(null);

    public participantId$: Observable<string>;
    public isLocal$: Observable<boolean>;
    public streamIds$: Observable<string[]>;

    constructor(
        private store: Store<AppState>,
    ) {
        this.participantId$ = this.idSubject.pipe(
            filter(id => !!id),
        );

        this.isLocal$ = this.participantId$.pipe(
            switchMap(id => this.store.select(selectParticipantIsLocal(id))),
        );

        this.streamIds$ = this.participantId$.pipe(
            switchMap(id => this.store.select(selectSettingsStreams(id))),
        );
    }

    refreshDevices() {
        this.store.dispatch(MediaActions.refresh());
    }

    setId(id: string) {
        this.idSubject.next(id);
    }

    getId() {
        return this.idSubject.getValue();
    }
}
