import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLWidgetsDialogComponent } from './pl-widgets-dialog.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PLDotLoaderModule } from '@root/index';
import { DndModule } from 'ngx-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

const exportedComponents = [
    PLWidgetsDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatDividerModule,
        MatBottomSheetModule,
        MatButtonModule,
        PLDotLoaderModule,
        DndModule,
        DragDropModule,
    ],
    exports: [...exportedComponents],
    declarations: [
        ...exportedComponents,
    ],
    providers: [],
})
export class PLWidgetsDialogModule { }
