import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectIsFirebaseConnected } from '@common/firebase/store';
import { ConferenceActions } from '@room/conference/store';
import { ConferenceStreamService } from '../../conference-stream.service';

@Injectable()
export class DismissService {
    canDismiss$: Observable<boolean>;
    constructor(
        private conferenceStreamService: ConferenceStreamService,
        private store: Store<AppState>,
    ) {
        this.canDismiss$ = store.select(selectIsFirebaseConnected).pipe(
            map(isFirebaseConnected => !isFirebaseConnected),
        );
    }

    dismiss() {
        this.store.dispatch(ConferenceActions.dismiss({
            id: this.conferenceStreamService.getId(),
        }));
    }
}
