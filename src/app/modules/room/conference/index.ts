import { NgModule } from '@angular/core';

import { ConferenceComponent } from './conference.component';
import { ConferenceRTService } from './conference-rt.service';
import { ConferenceService } from './conference.service';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { PLDotLoaderModule } from '@root/src/lib-components';
import {
    reducer as conferenceReducer,
    ConferenceEffects,
    ConferenceLocalStreamsEffects,
    ConferenceRemoteStreamsEffects,
    ConferenceCleanupEffects,
} from './store';
import { ScreenshareComponent } from './screenshare/screenshare.component';
import { ConferenceStreamModule } from './conference-stream';
import { ScreenshareService } from './screenshare/screenshare.service';
import {
    reducer as screenshareReducer,
    ScreenshareEffects,
} from './screenshare/store';
import { ConferenceCommonModule } from './common';

const exportedComponents = [
    ScreenshareComponent,
    ConferenceComponent,
];

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('conference', conferenceReducer),
        StoreModule.forFeature('screenshare', screenshareReducer),
        EffectsModule.forFeature([
            ConferenceEffects,
            ConferenceLocalStreamsEffects,
            ConferenceRemoteStreamsEffects,
            ConferenceCleanupEffects,
            ScreenshareEffects,
        ]),
        ConferenceCommonModule,
        ConferenceStreamModule,
        PLDotLoaderModule,
    ],
    exports: [
        ...exportedComponents,
    ],
    declarations: [
        ...exportedComponents,
    ],
    providers: [
        ConferenceRTService,
        ConferenceService,
        ScreenshareService,
    ],
})
export class ConferenceModule { }

export * from './conference-rt.service';
export * from './conference.service';
