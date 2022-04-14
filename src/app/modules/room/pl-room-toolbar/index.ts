import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLRoomToolbarComponent } from './pl-room-toolbar.component';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatBadgeModule } from '@angular/material/badge';
import { PLParticipantsDialogModule } from './dialogs/pl-participants-dialog';
import { PLRoomLinkDialogModule } from './dialogs/pl-room-link-dialog';
import { PLWorkspaceDialogModule } from './dialogs/pl-workspace-dialog';
import { PLControlsDialogModule } from './dialogs/pl-controls-dialog';
import { PLWidgetsDialogModule } from './dialogs/pl-widgets-dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { PLUserMenuComponent } from './pl-user-menu/pl-user-menu.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PLRoomToolbarButtonComponent } from './pl-room-toolbar-button/pl-room-toolbar-button.component';
import { PLSnackBarDialogComponent } from './snackbar-dialog/snackbar-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { PLRoomOverlayDialogModule } from './dialogs/pl-room-overlay';
import { PLAnimationsDialogModule } from './dialogs/pl-animations-dialog';

const exportedComponents = [
    PLRoomToolbarComponent,
    PLRoomToolbarButtonComponent,
    PLUserMenuComponent,
    PLSnackBarDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        PLParticipantsDialogModule,
        PLRoomLinkDialogModule,
        PLWorkspaceDialogModule,
        PLControlsDialogModule,
        PLWidgetsDialogModule,
        PLRoomOverlayDialogModule,
        PLAnimationsDialogModule,
        MatIconModule,
        MatDividerModule,
        MatBottomSheetModule,
        MatBadgeModule,
        MatToolbarModule,
        MatMenuModule,
        ClipboardModule,
        MatButtonModule,
        MatSnackBarModule,
        MatSliderModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLRoomToolbarModule {
    constructor() {
    }
}
