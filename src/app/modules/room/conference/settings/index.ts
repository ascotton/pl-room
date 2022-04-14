import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ConferenceCommonModule } from '../common';
import { StreamSettingsActionComponent } from './stream-settings-action/stream-settings-action.component';
import { StreamSettingsComponent } from './stream-settings.component';
import { LocalSettingsModule } from './local-settings';
import { RemoteSettingsModule } from './remote-settings';

const exportedComponents = [
    StreamSettingsActionComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        ConferenceCommonModule,
        LocalSettingsModule,
        RemoteSettingsModule,
    ],
    exports: [
        ...exportedComponents,
    ],
    declarations: [
        StreamSettingsComponent,
        ...exportedComponents,
    ],
    providers: [],
})
export class StreamSettingsModule { }
