import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { VideoSettingsCommonModule } from '../common';
import { SecondaryVideoSettingsComponent } from './secondary-video-settings.component';
import { SecondaryVideoDeviceComponent } from './secondary-video-device/secondary-video-device.component';
import { RequestPermissionsComponent } from './request-permissions/request-permissions.component';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        VideoSettingsCommonModule,
    ],
    exports: [SecondaryVideoSettingsComponent],
    declarations: [
        RequestPermissionsComponent,
        SecondaryVideoDeviceComponent,
        SecondaryVideoSettingsComponent,
    ],
    providers: [],
})
export class SecondaryVideoSettingsModule { }
