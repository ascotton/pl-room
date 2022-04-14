import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PLControlsDialogComponent } from './pl-controls-dialog.component';
import { MatIconModule } from '@angular/material/icon';

const exportedComponents = [
    PLControlsDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatDividerModule,
        MatBottomSheetModule,
        MatSlideToggleModule,
        MatIconModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLControlsDialogModule { }
