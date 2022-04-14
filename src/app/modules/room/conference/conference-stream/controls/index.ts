import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamMicActionComponent } from './stream-mic-action/stream-mic-action.component';
import { StreamVideoActionComponent } from './stream-video-action/stream-video-action.component';
import { StreamScreenshotActionComponent } from './stream-screenshot-action/stream-screenshot-action.component';
import { ConferenceCommonModule } from '../../common';

const exportedComponents = [
    StreamMicActionComponent,
    StreamVideoActionComponent,
    StreamScreenshotActionComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ConferenceCommonModule,
    ],
    exports: [
        ...exportedComponents,
    ],
    declarations: [
        ...exportedComponents,
    ],
    providers: [],
})
export class ConferenceStreamControlsModule { }
