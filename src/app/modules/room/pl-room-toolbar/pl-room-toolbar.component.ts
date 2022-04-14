import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet, matBottomSheetAnimations } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { ProfileMenuActions } from '@room/pl-profile-menu/store';
import { AppModel } from '@root/src/app/common/models/app-model.service';
import { FirebaseAppModel } from '@root/src/app/common/models/firebase/firebase-app-model.service';
import { ParticipantStatus, selectWaitingRoomList } from '@room/session/store';
import { AppState } from '@root/src/app/store';
import { Subscription, Observable } from 'rxjs';
import { selectCurrentUser } from '../../user/store';
import { PLControlsDialogComponent } from './dialogs/pl-controls-dialog/pl-controls-dialog.component';
import { PLWidgetsDialogComponent } from './dialogs/pl-widgets-dialog/pl-widgets-dialog.component';
import { PLRoomLinkDialogComponent } from './dialogs/pl-room-link-dialog/pl-room-link-dialog.component';
import {
    layoutModesMap,
    PLWorkspaceDialogComponent,
} from './dialogs/pl-workspace-dialog/pl-workspace-dialog.component';
import { PLParticipantsDialogComponent } from './dialogs/pl-participants-dialog/pl-participants-dialog.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { selectLayoutMode, selectIsLayoutModeFullScreen } from '../app/store';
import { PLSnackBarDialogComponent } from './snackbar-dialog/snackbar-dialog.component';
import { PLRoomOverlayDialogComponent } from './dialogs/pl-room-overlay/room-overlay.component';
import { PLAnimationsDialogComponent } from './dialogs/pl-animations-dialog/pl-animations-dialog.component';

export enum RoomToolbarOptions {
    RoomLink,
    Participants,
    Workspace,
    Controls,
    Animations,
    Chat,
    Overlays,
    Help,
    Widgets,
}

@Component({
    selector: 'pl-room-toolbar',
    templateUrl: 'pl-room-toolbar.component.html',
    styleUrls: ['./pl-room-toolbar.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLRoomToolbarComponent implements OnInit, OnDestroy {
    currentDialog: RoomToolbarOptions;
    toolbarOptions = RoomToolbarOptions;
    showWaitingRoomNotification = false;
    userName = '';
    snackBarRef: MatSnackBarRef<PLSnackBarDialogComponent>;
    workspaceIcon = layoutModesMap.compact.icon;

    isFullscreen$: Observable<boolean>;

    private dismissRef: Subscription;
    private subscriptions: Subscription[] = [];

    constructor(private bottomSheet: MatBottomSheet,
                private store: Store<AppState>,
                private appModel: AppModel,
                private firebaseAppModel: FirebaseAppModel,
                private snackBar: MatSnackBar) {

        this.isFullscreen$ = store.select(selectIsLayoutModeFullScreen);

        this.subscriptions.push(
            this.store.select(selectWaitingRoomList).subscribe((participants) => {
                const waitingParticipants = participants.filter(p => p.status === ParticipantStatus.waiting);
                this.showWaitingRoomNotification = waitingParticipants.length > 0;
                if (this.showWaitingRoomNotification && !this.snackBarRef) {
                    this.snackBarRef = this.snackBar.openFromComponent(PLSnackBarDialogComponent, {
                        horizontalPosition: 'left',
                        data: {
                            message: 'A client wants to join this room.',
                            actionText: 'Manage Waiting Room',
                        },
                        panelClass: 'snackbar-big',
                    });
                    this.snackBarRef.onAction().subscribe(() => {
                        this.onClickOption(RoomToolbarOptions.Participants);
                    });
                    this.snackBarRef.afterDismissed().subscribe(() => {
                        this.snackBarRef = null;
                    });
                } else if (!this.showWaitingRoomNotification) {
                    if (this.snackBarRef) {
                        this.snackBarRef.dismiss();
                    }
                }
            }),
            this.store.select(selectCurrentUser).subscribe((user) => {
                this.userName = user.display_name;
            }),
            this.store.select(selectLayoutMode).subscribe((mode) => {
                if (mode) {
                    const icon = layoutModesMap[mode].icon;
                    this.workspaceIcon = icon;
                }
            }),
        );
        // Remove default Angular Material animations
        matBottomSheetAnimations.bottomSheetState.definitions.splice(2, 2);
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onClickOption(selectedOption: RoomToolbarOptions) {
        if (this.currentDialog !== selectedOption) {
            let component;
            let panelClass: string = null;
            switch (selectedOption) {
                    case RoomToolbarOptions.Participants:
                        component = PLParticipantsDialogComponent;
                        break;
                    case RoomToolbarOptions.RoomLink:
                        component = PLRoomLinkDialogComponent;
                        break;
                    case RoomToolbarOptions.Workspace:
                        component = PLWorkspaceDialogComponent;
                        panelClass = 'sheet-medium';
                        break;
                    case RoomToolbarOptions.Controls:
                        component = PLControlsDialogComponent;
                        panelClass = 'sheet-medium';
                        break;
                    case RoomToolbarOptions.Widgets:
                        component = PLWidgetsDialogComponent;
                        panelClass = 'sheet-medium';
                        break;
                    case RoomToolbarOptions.Overlays:
                        component = PLRoomOverlayDialogComponent;
                        panelClass = 'sheet-medium';
                        break;
                    case RoomToolbarOptions.Animations:
                        component = PLAnimationsDialogComponent;
                        break;
            }
            this.currentDialog = selectedOption;
            if (component) {
                if (this.dismissRef) {
                    this.bottomSheet.dismiss();
                    this.dismissRef.unsubscribe();
                }
                const sheet = this.bottomSheet.open(component, {
                    panelClass: ['sheet-dialog', panelClass],
                    backdropClass: 'sheet-backdrop',
                });
                // Add custom panel class to handle bottom sheet at the top
                const containerInstance = sheet.containerInstance as any;
                const containerRef = containerInstance._elementRef.nativeElement;
                const parentElement = containerRef.parentElement; // < cdk-overlay-pane
                parentElement.classList.add('bottom-sheet-pane');

                this.dismissRef = sheet.afterDismissed().subscribe(() => {
                    this.toggleOverlayClass(false);
                    this.currentDialog = null;
                });
                this.toggleOverlayClass(true);
            }
        } else {
            this.bottomSheet.dismiss();
        }
    }

    toggleWhiteboard() {
        this.appModel.toggleWhiteboard();
    }

    showProfileMenu() {
        this.store.dispatch(ProfileMenuActions.toggleDisplay());
    }

    get whiteboardActive() {
        return this.firebaseAppModel.app.whiteboardActive;
    }

    private toggleOverlayClass(enabled) {
        const elements = document.getElementsByClassName('cdk-overlay-container');
        if (elements.length) {
            if (enabled) {
                elements[0].classList.add('toolbar-overlay');
            } else {
                elements[0].classList.remove('toolbar-overlay');
            }
        }
    }
}
