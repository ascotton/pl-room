import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLRoomOverlayDialogComponent } from './room-overlay.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const exportedComponents = [
    PLRoomOverlayDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatSliderModule,
        MatSlideToggleModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLRoomOverlayDialogModule { }
