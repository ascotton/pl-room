import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MediaModule } from '@common/media';
import { AudioSettingsComponent } from './audio-settings.component';
import { SpeakersTestComponent } from './speakers-test/speakers-test.component';
import { MicSettingsComponent } from './mic-settings/mic-settings.component';
import { AudioDeviceComponent } from './audio-device/audio-device.component';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MediaModule,
    ],
    exports: [AudioSettingsComponent],
    declarations: [
        AudioDeviceComponent,
        SpeakersTestComponent,
        MicSettingsComponent,
        AudioSettingsComponent,
    ],
    providers: [],
})
export class AudioSettingsModule { }
