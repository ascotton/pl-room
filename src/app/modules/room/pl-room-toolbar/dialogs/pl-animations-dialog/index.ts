import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { PLAnimationsDialogComponent } from './pl-animations-dialog.component';
import { CommonAnimationsModule } from './common-animations';
import { GiphyAnimaitonsModule } from './giphy-animations';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTabsModule,
        CommonAnimationsModule,
        GiphyAnimaitonsModule,
    ],
    exports: [PLAnimationsDialogComponent],
    declarations: [PLAnimationsDialogComponent],
    providers: [],
})
export class PLAnimationsDialogModule { }
