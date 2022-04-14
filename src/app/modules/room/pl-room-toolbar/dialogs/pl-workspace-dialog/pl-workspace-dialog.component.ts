import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { Subscription } from 'rxjs';
import { LayoutMode, selectLayoutMode, AppActions } from '@room/app/store';

export const layoutModesMap: Record<LayoutMode, { label: string; icon: string; image: string; }> = {
    [LayoutMode.compact]: {
        label: 'Compact',
        image: 'layout-compact.png',
        icon: 'workspace-compact',
    },
    [LayoutMode.jumbotron]: {
        label: 'Jumbotron',
        image: 'layout-jumbotron.png',
        icon: 'workspace-jumbotron',
    },
    [LayoutMode.grid]: {
        label: 'Grid',
        image: 'layout-grid.png',
        icon: 'workspace-grid',
    },
};

@Component({
    selector: 'pl-workspace-dialog',
    templateUrl: 'pl-workspace-dialog.component.html',
    styleUrls: ['./pl-workspace-dialog.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLWorkspaceDialogComponent implements OnInit, OnDestroy {
    public readonly layoutModesOptions = Object.keys(layoutModesMap)
        .map(key => ({ value: key, ...layoutModesMap[key] }));
    currentLayoutMode: LayoutMode;
    private subscriptions: Subscription[] = [];

    constructor(private bottomsheet: MatBottomSheetRef<PLWorkspaceDialogComponent>,
                private store: Store<AppState>) {
        this.subscriptions.push(
            this.store.select(selectLayoutMode).subscribe((layoutMode) => {
                this.currentLayoutMode = layoutMode;
            }),
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onClose() {
        this.bottomsheet.dismiss();
    }

    onLayoutChange(layoutMode: LayoutMode) {
        this.store.dispatch(AppActions.setLayoutMode({ layoutMode }));
    }

}
