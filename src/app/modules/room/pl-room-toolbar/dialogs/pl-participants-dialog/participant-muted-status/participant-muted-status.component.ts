import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectParticipantIsMuted } from '@room/conference/store';

@Component({
    selector: 'pl-participant-muted-status',
    templateUrl: 'participant-muted-status.component.html',
})

export class ParticipantMutedStatusComponent implements OnInit {
    @Input() private participantId: string;

    public isMuted$: Observable<boolean>;
    constructor(
        private store: Store<AppState>,
    ) {
    }

    ngOnInit() {
        this.isMuted$ = this.store.select(selectParticipantIsMuted(this.participantId));
    }
}
