import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ConferenceCommonModule } from '@room/conference/common';
import { MirrorVideoComponent } from './mirror-video/mirror-video.component';
import { RotateVideoComponent } from './rotate-video/rotate-video.component';
import { SettingsVideoBoxComponent } from './settings-video-box/settings-video-box.component';
import { VideoLabelComponent } from './video-label/video-label.component';
import { VideoSettingsContainerComponent } from './video-settings-container/video-settings-container.component';
import { VideoSettingsContainerService } from './video-settings-container/video-settings-container.service';
import { CoverVideoComponent } from './cover-video/cover-video.component';

const exportedComponents = [
    VideoLabelComponent,
    SettingsVideoBoxComponent,
    RotateVideoComponent,
    MirrorVideoComponent,
    CoverVideoComponent,
    VideoSettingsContainerComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        ConferenceCommonModule,
    ],
    exports: [...exportedComponents],
    declarations: [...exportedComponents],
})
export class VideoSettingsCommonModule { }

export {
    VideoSettingsContainerService,
};
