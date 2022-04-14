import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    PLButtonModule,
    PLConfirmDialogService,
} from '@root/index';

import { PLInactiveComponent } from './pl-inactive/pl-inactive.component';
import { PLInactiveService } from './pl-inactive/pl-inactive.service';
import { PLRoomCleanupService } from './pl-inactive/pl-room-cleanup.service';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store';

@NgModule({
    imports: [
        CommonModule,
        PLButtonModule,
        StoreModule.forFeature('auth', reducer),
    ],
    exports: [
        PLInactiveComponent,
    ],
    declarations: [
        PLInactiveComponent,
    ],
    providers: [
        PLConfirmDialogService,
        PLInactiveService,
        PLRoomCleanupService,
    ],
})
export class PLUserModule {}

export { PLInactiveComponent } from './pl-inactive/pl-inactive.component';
export { PLInactiveService } from './pl-inactive/pl-inactive.service';
