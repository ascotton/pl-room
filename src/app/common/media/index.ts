
import { NgModule } from '@angular/core';

import { PLAudioLevelIndicatorComponent } from './pl-audio-level-indicator/pl-audio-level-indicator.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

const exportedComponents = [
    PLAudioLevelIndicatorComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
    ],
    exports: [
        ...exportedComponents,
    ],
    declarations: [
        ...exportedComponents,
    ],
    providers: [],
})
export class MediaModule { }

export {
    PLAudioLevelIndicatorComponent,
};

export * from './devices-history.service';
export * from './devices.service';
export * from './playback';
