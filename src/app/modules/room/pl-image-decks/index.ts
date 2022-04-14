import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    PLButtonModule,
    PLDotLoaderModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { PLActivitiesComponent } from "./pl-activities.component";
import { PLActivitySaveComponent } from "./pl-activity-save.component";
import { PLActivityViewComponent } from "./pl-activity-view.component";
import { PLImageDecksComponent } from "./pl-image-decks.component";
import { PLImageDeckSaveComponent } from "./pl-image-deck-save.component";
import { PLImageDeckViewComponent } from "./pl-image-deck-view.component";
import { PLImageSaveComponent } from "./pl-image-save.component";

import { PLImageSaveService } from "./pl-image-save.service";
import { PLActivityTagsService } from "./pl-activity-tags.service";
import { PLImageDeckCopyService } from "./pl-image-deck-copy.service";
import { PLImageDecksGetService } from './image-decks-get.service';

@NgModule({
    imports: [
        CommonModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLIconModule,
        PLInputModule,
    ],
    exports: [
        PLActivitiesComponent,
        PLActivitySaveComponent,
        PLActivityViewComponent,
        PLImageDecksComponent,
        PLImageDeckSaveComponent,
        PLImageDeckViewComponent,
        PLImageSaveComponent,
    ],
    declarations: [
        PLActivitiesComponent,
        PLActivitySaveComponent,
        PLActivityViewComponent,
        PLImageDecksComponent,
        PLImageDeckSaveComponent,
        PLImageDeckViewComponent,
        PLImageSaveComponent,
    ],
    providers: [
        PLImageSaveService,
        PLActivityTagsService,
        PLImageDeckCopyService,
        PLImageDecksGetService,
    ],
})
export class PLImageDecksModule {}

export { PLActivitiesComponent } from "./pl-activities.component";
export { PLImageDecksComponent } from "./pl-image-decks.component";
