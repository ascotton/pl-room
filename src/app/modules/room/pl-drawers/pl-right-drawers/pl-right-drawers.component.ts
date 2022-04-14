import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DrawerNameType, DrawerState, selectDrawer } from '../store';
import { AppState } from '@root/src/app/store';

@Component({
    selector: 'pl-right-drawers',
    templateUrl: './pl-right-drawers.component.html',
    styleUrls: ['./pl-right-drawers.component.less'],
})
export class PLRightDrawersComponent implements OnInit, OnDestroy {
    drawerSubscription: Subscription;
    drawer?: DrawerState;

    constructor(
        private store: Store<AppState>,
    ) {
    }

    ngOnInit() {
        this.drawerSubscription = this.store.select(selectDrawer)
            .subscribe((state) => {
                this.drawer = state;
            });
    }

    ngOnDestroy() {
        this.drawerSubscription.unsubscribe();
    }

    isDrawerActive(drawerName: DrawerNameType) {
        return this.drawer.open && this.drawer.activeName === drawerName;
    }
}
