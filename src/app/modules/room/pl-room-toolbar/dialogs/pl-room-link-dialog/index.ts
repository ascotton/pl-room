import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLRoomLinkDialogComponent } from './pl-room-link-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const exportedComponents = [
    PLRoomLinkDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatDividerModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ClipboardModule,
        MatButtonModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
    providers: [],
})
export class PLRoomLinkDialogModule { }
