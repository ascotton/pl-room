import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLWorkspaceDialogComponent } from './pl-workspace-dialog.component';

import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';


const exportedComponents = [
    PLWorkspaceDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatDividerModule,
        MatBottomSheetModule,
        MatIconModule,
        MatRadioModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLWorkspaceDialogModule { }
