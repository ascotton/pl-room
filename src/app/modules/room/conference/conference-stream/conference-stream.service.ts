import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ParticipantType } from '@room/session/store';
import { StreamType, selectStreamIsLocal, selectStreamParticipantId } from '../store';

export interface ConferenceStreamInfo {
    isLocal: boolean;
    type: StreamType;
    participantType: ParticipantType;
}

@Injectable()
export class ConferenceStreamService {
    private idSubject = new BehaviorSubject<string | null>(null);

    public streamId$: Observable<string>;
    public isLocal$: Observable<boolean>;
    public participantId$: Observable<string>;

    constructor(
        private store: Store<AppState>,
    ) {
        this.streamId$ = this.idSubject.pipe(
            filter(id => !!id),
        );

        this.isLocal$ = this.streamId$.pipe(
            switchMap(id => this.store.select(selectStreamIsLocal(id))),
        );

        this.participantId$ = this.streamId$.pipe(
            switchMap(id => this.store.select(selectStreamParticipantId(id))),
        );
    }

    setId(id: string) {
        this.idSubject.next(id);
    }

    getId() {
        return this.idSubject.getValue();
    }
}
