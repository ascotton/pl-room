import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoSettingsComponent } from './video-settings.component';
import { PrimaryVideoSettingsModule } from './primary-video';
import { SecondaryVideoSettingsModule } from './secondary-video';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    imports: [
        CommonModule,
        MatDividerModule,
        PrimaryVideoSettingsModule,
        SecondaryVideoSettingsModule,
    ],
    exports: [VideoSettingsComponent],
    declarations: [VideoSettingsComponent],
    providers: [],
})
export class VideoSettingsModule { }
