import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ConferenceVideoComponent } from './conference-video/conference-video.component';
import { StreamActionComponent } from './stream-action/stream-action.component';

const exportedComponents = [
    ConferenceVideoComponent,
    StreamActionComponent,
];
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
    ],
    exports: [
        ...exportedComponents,
    ],
    declarations: [
        ...exportedComponents,
    ],
    providers: [],
})
export class ConferenceCommonModule { }
