import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { PLUrlsService } from '@root/src/lib-components';
import { AppState } from '@app/store';
import { WaitingRoomHelperService } from '../../waiting-room/waiting-room-helper.service';
import { SessionActions } from '../session/store';

@Component({
    selector: 'pl-duplicated-provider',
    templateUrl: 'duplicated-provider.component.html',
    styleUrls: ['duplicated-provider.component.less'],
})

export class DuplicatedProviderComponent implements OnInit, OnDestroy {
    sub: Subscription;
    landingUrl: string;
    loading = false;

    constructor(
        private plUrls: PLUrlsService,
        private store: Store<AppState>,
        private actions$: Actions,
        private helper: WaitingRoomHelperService,
    ) {
        this.landingUrl = this.plUrls.urls.landingFE;
    }

    ngOnInit() {
        this.sub = this.listenToKickDuplicatedsSuccess();
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    continueHere() {
        this.loading = true;
        this.store.dispatch(SessionActions.kickDuplicateds());
    }

    listenToKickDuplicatedsSuccess() {
        return this.actions$.pipe(
            ofType(SessionActions.kickDuplicatedsSuccess),
        ).subscribe(() => {
            this.helper.redirectToClinicianRoom();
        });
    }
}
