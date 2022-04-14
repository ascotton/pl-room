import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';

import { VideoSettingsModule } from '../video-settings';
import { LocalSettingsComponent } from './local-settings.component';
import { AudioSettingsModule } from './audio-settings';

@NgModule({
    imports: [
        CommonModule,
        MatTabsModule,
        AudioSettingsModule,
        VideoSettingsModule,
    ],
    exports: [LocalSettingsComponent],
    declarations: [LocalSettingsComponent],
    providers: [],
})
export class LocalSettingsModule { }
