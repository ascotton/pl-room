import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamSettingsModule } from '../../settings';

import { StreamBoxModule } from '../stream-box';
import { ConferenceStreamControlsModule } from '../controls';

import { LocalStreamComponent } from './local-stream.component';

const exportedComponents = [
    LocalStreamComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ConferenceStreamControlsModule,
        StreamBoxModule,
        StreamSettingsModule,
    ],
    exports: [
        ...exportedComponents,
    ],
    declarations: [
        ...exportedComponents,
    ],
    providers: [],
})
export class LocalStreamModule { }
