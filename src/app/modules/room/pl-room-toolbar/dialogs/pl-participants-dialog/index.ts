import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLParticipantsDialogComponent } from './pl-participants-dialog.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PLDotLoaderModule } from '@root/index';
import { ParticipantMutedStatusComponent } from './participant-muted-status/participant-muted-status.component';

const exportedComponents = [
    PLParticipantsDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatDividerModule,
        MatBottomSheetModule,
        MatButtonModule,
        PLDotLoaderModule,
    ],
    exports: [...exportedComponents],
    declarations: [
        ParticipantMutedStatusComponent,
        ...exportedComponents,
    ],
    providers: [],
})
export class PLParticipantsDialogModule { }
