import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { PLFlashcardsWidgetComponent } from './flashcards-widget.component';

@NgModule({
    imports: [BrowserModule, MatButtonModule],
    declarations: [PLFlashcardsWidgetComponent],
    bootstrap:    [PLFlashcardsWidgetComponent],
    exports: [PLFlashcardsWidgetComponent],
})
export class FlashcardsWidgetModule { }
