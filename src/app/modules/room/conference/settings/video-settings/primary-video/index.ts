import { NgModule } from '@angular/core';

import { PrimaryVideoSettingsComponent } from './primary-video-settings.component';
import { CommonModule } from '@angular/common';
import { VideoSettingsCommonModule } from '../common';
import { VideoDeviceSelectComponent } from './video-device-select/video-device-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        VideoSettingsCommonModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    exports: [PrimaryVideoSettingsComponent],
    declarations: [
        VideoDeviceSelectComponent,
        PrimaryVideoSettingsComponent,
    ],
    providers: [],
})
export class PrimaryVideoSettingsModule { }
