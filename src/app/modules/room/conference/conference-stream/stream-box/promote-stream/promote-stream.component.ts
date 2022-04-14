import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { Observable } from 'rxjs';
import { ConferenceStreamService } from '../../conference-stream.service';
import { switchMap, map } from 'rxjs/operators';
import { selectStreamIsPromoted, ConferenceActions, selectCanPromote } from '@room/conference/store';

@Component({
    selector: 'pl-promote-stream',
    templateUrl: 'promote-stream.component.html',
    styleUrls: ['promote-stream.component.less'],
})

export class PromoteStreamComponent implements OnInit {

    public isPromoted$: Observable<boolean>;
    public canShow$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
        private conferenceStreamService: ConferenceStreamService,
    ) {
        this.isPromoted$ = this.conferenceStreamService.streamId$.pipe(
            switchMap(id => this.store.select(selectStreamIsPromoted(id))),
        );

        this.canShow$ = this.store.select(selectCanPromote);
    }

    ngOnInit() { }

    promote() {
        this.store.dispatch(ConferenceActions.promote({
            id: this.conferenceStreamService.getId(),
        }));
    }

    demote() {
        this.store.dispatch(ConferenceActions.demote({
            id: this.conferenceStreamService.getId(),
        }));
    }
}
