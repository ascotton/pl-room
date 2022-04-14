import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceStreamComponent } from './conference-stream.component';
import { LocalStreamModule } from './local-stream';
import { RemoteStreamModule } from './remote-stream';

const exportedComponents = [
    ConferenceStreamComponent,
];

@NgModule({
    imports: [
        CommonModule,
        LocalStreamModule,
        RemoteStreamModule,
    ],
    exports: [...exportedComponents],
    declarations: [
        ...exportedComponents,
    ],
    providers: [],
})
export class ConferenceStreamModule { }
