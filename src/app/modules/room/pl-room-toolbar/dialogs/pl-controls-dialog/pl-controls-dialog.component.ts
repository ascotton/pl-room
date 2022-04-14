import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { Subscription } from 'rxjs';
import { AppActions, selectClientClickMuted, selectSharedCursorOn, selectSharedCursorToggleDisabled } from '@room/app/store';
import { PLSnackBarDialogComponent } from '../../snackbar-dialog/snackbar-dialog.component';

@Component({
    selector: 'pl-controls-dialog',
    templateUrl: 'pl-controls-dialog.component.html',
    styleUrls: ['./pl-controls-dialog.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLControlsDialogComponent implements OnInit, OnDestroy {
    isClientClickMuted$ = this.store.select(selectClientClickMuted);
    isCursorShared$ = this.store.select(selectSharedCursorOn);
    isCursorSharingToggleDisabled$ = this.store.select(selectSharedCursorToggleDisabled);

    private subscriptions: Subscription[] = [];

    constructor(private store: Store<AppState>,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onCursorSharedChanged(newState, showSnackBar = true) {
        this.store.dispatch(
            AppActions.setCursorSharing({ isCursorShared: newState, isToggleDisabled: false }),
        );
        if (showSnackBar) {
            const snackBar = this.snackBar.openFromComponent(PLSnackBarDialogComponent, {
                horizontalPosition: 'left',
                data: {
                    message: `Shared cursor tracking turned ${newState ? 'on' : 'off'}`,
                    actionText: 'Undo',
                },
            });
            snackBar.onAction().subscribe(() => this.onCursorSharedChanged(!newState, false));
        }
    }

    onClientClickChange(newState, showSnackBar = true) {
        this.store.dispatch(AppActions.setClientMouseClick({ isClientClickMuted: newState }));
        if (showSnackBar) {
            const snackBar = this.snackBar.openFromComponent(PLSnackBarDialogComponent, {
                horizontalPosition: 'left',
                data: {
                    message: `Client mouse clicking turned ${newState ? 'off' : 'on'}`,
                    actionText: 'Undo',
                },
            });
            snackBar.onAction().subscribe(() => this.onClientClickChange(!newState, false));
        }
    }

}
