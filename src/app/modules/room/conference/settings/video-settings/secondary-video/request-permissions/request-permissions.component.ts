import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { Observable } from 'rxjs';
import { selectIsMediaLoading, MediaActions } from '@common/media/store';

@Component({
    selector: 'pl-request-permissions',
    templateUrl: 'request-permissions.component.html',
})

export class RequestPermissionsComponent implements OnInit {
    public isLoading$: Observable<boolean>;
    constructor(
        private store: Store<AppState>,
    ) {
        this.isLoading$ = store.select(selectIsMediaLoading);
    }

    ngOnInit() { }

    requestPermissions() {
        this.store.dispatch(MediaActions.refresh());
    }
}
