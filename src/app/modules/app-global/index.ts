import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PLDialogModule, PLModalModule, PLToastModule } from '@root/index';
import { AppGlobalComponent } from './app-global.component';

@NgModule({
    imports: [
        BrowserModule,
        PLToastModule,
        PLModalModule,
        PLDialogModule,
    ],
    declarations: [
        AppGlobalComponent,
    ],
    exports: [
        AppGlobalComponent,
    ],
})
export class PLAppGlobalModule { }
