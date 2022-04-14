import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop'

import {
    PLButtonModule,
    PLDotLoaderModule,
    PLHttpModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { PLImageDecksModule } from '@app/modules/room/pl-image-decks';

import { PLQueueAddComponent } from './pl-queue-add.component';
import { PLQuickYoutubeComponent, PLQuickYoutubeDialogComponent } from './pl-quick-youtube/pl-quick-youtube.component';
import { PLYouTubeService } from './pl-quick-youtube/pl-you-tube.service';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLHttpModule,
        PLIconModule,
        PLInputModule,
        PLImageDecksModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        DragDropModule,
    ],
    exports: [
        PLQueueAddComponent,
        PLQuickYoutubeComponent,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        DragDropModule,
    ],
    declarations: [
        PLQueueAddComponent,
        PLQuickYoutubeComponent,
        PLQuickYoutubeDialogComponent,
    ],
    providers: [
        PLYouTubeService,
    ],
})
export class PLQueueAddModule {}

export { PLQueueAddComponent } from './pl-queue-add.component';
