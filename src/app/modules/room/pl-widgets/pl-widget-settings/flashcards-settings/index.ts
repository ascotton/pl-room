import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { PLDotLoaderModule } from '@root/index';
import { PLImageDecksModule } from '@room/pl-image-decks';
import { PLFlashcardsSettingsComponent } from './flashcards-settings.component';

@NgModule({
    imports: [
        BrowserModule,
        PLImageDecksModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatCardModule,
        PLDotLoaderModule,
    ],
    declarations: [
        PLFlashcardsSettingsComponent,
    ],
    exports: [
        PLFlashcardsSettingsComponent,
    ],
})
export class PLFlashcardsSettingsModule { }