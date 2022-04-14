import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoSettingsModule } from '../video-settings';
import { RemoteSettingsComponent } from './remote-settings.component';

@NgModule({
    imports: [
        CommonModule,
        VideoSettingsModule,
    ],
    exports: [RemoteSettingsComponent],
    declarations: [RemoteSettingsComponent],
    providers: [],
})
export class RemoteSettingsModule { }
