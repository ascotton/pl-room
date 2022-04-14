import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    PLButtonModule,
    PLDotLoaderModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { PLCommonOverlaysComponent } from './pl-common-overlays/pl-common-overlays.component';
import { PLDisclosureComponent } from './pl-disclosure/pl-disclosure.component';
import { PLDocumentItemComponent } from './pl-document-item/pl-document-item.component';
import { PLSliderComponent } from './pl-slider/pl-slider.component';
import { PLLoaderOverlayComponent } from './pl-loader-overlay/pl-loader-overlay.component';
import { PLHijackDrawerComponent } from './pl-hijack-drawer/pl-hijack-drawer.component';
import { PLClientAppointmentsSelectComponent } from './pl-client-appointment-select/pl-client-appointments-select.component';

@NgModule({
    imports: [
        CommonModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLIconModule,
        PLInputModule,
        FormsModule,
    ],
    exports: [
        PLClientAppointmentsSelectComponent,
        PLCommonOverlaysComponent,
        PLDisclosureComponent,
        PLDocumentItemComponent,
        PLSliderComponent,
        PLLoaderOverlayComponent,
        PLHijackDrawerComponent,
    ],
    declarations: [
        PLClientAppointmentsSelectComponent,
        PLCommonOverlaysComponent,
        PLDisclosureComponent,
        PLDocumentItemComponent,
        PLSliderComponent,
        PLLoaderOverlayComponent,
        PLHijackDrawerComponent,
    ],
    providers: [],
})
export class PLCommonComponentsModule {}

export { PLCommonOverlaysComponent } from './pl-common-overlays/pl-common-overlays.component';
export { PLDisclosureComponent } from './pl-disclosure/pl-disclosure.component';
export { PLDocumentItemComponent } from './pl-document-item/pl-document-item.component';
export { PLSliderComponent } from './pl-slider/pl-slider.component';
export { PLClientAppointmentsSelectComponent } from './pl-client-appointment-select/pl-client-appointments-select.component';
export * from './pl-expansion-panel';
