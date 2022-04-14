import { NgModule } from '@angular/core';

import { RemoteStreamComponent } from './remote-stream.component';
import { DismissActionComponent } from './dismiss-action/dismiss-action.component';
import { CommonModule } from '@angular/common';
import { StreamBoxModule } from '../stream-box';
import { ConferenceStreamControlsModule } from '../controls';
import { ConferenceCommonModule } from '../../common';
import { StreamSettingsModule } from '../../settings';

const exportedComponents = [
    RemoteStreamComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ConferenceCommonModule,
        ConferenceStreamControlsModule,
        StreamBoxModule,
        StreamSettingsModule,
    ],
    exports: [
        ...exportedComponents,
    ],
    declarations: [
        DismissActionComponent,
        ...exportedComponents,
    ],
    providers: [],
})
export class RemoteStreamModule { }
