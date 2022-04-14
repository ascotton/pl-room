import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamBoxComponent } from './stream-box.component';
import { StreamVideoBoxComponent } from './stream-video-box/stream-video-box.component';
import { ConferenceCommonModule } from '../../common';
import { PromoteStreamComponent } from './promote-stream/promote-stream.component';
import { MatIconModule } from '@angular/material/icon';
import { StreamDisplayNameComponent } from './display-name/display-name.component';
import { PLVideoCaptureModule } from '@room/pl-video-capture';
import { StreamStatusComponent } from './stream-status/stream-status.component';

@NgModule({
    imports: [
        CommonModule,
        ConferenceCommonModule,
        MatIconModule,
        PLVideoCaptureModule,
    ],
    exports: [StreamBoxComponent],
    declarations: [
        StreamStatusComponent,
        PromoteStreamComponent,
        StreamDisplayNameComponent,
        StreamVideoBoxComponent,
        StreamBoxComponent,
    ],
    providers: [],
})
export class StreamBoxModule { }
