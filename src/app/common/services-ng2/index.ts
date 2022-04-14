import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntrojsService } from './introjs.service';
import { LoginMonitorService } from './login-monitor.service';
import { PLAppointmentService, PLRecordParticipantsService, PLRecordRoomService } from './pl-records/index';
import { ResizeObserverService } from './resize-observer.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
    ],
    declarations: [
    ],
    providers: [
        IntrojsService,
        LoginMonitorService,
        PLAppointmentService,
        PLRecordParticipantsService,
        PLRecordRoomService,
        ResizeObserverService,
    ],
})
export class PLCommonServicesModule {}

export { IntrojsService } from './introjs.service';
export { LoginMonitorService } from './login-monitor.service';
export { ResizeObserverService } from './resize-observer.service';
export * from './resize-observer.service';
export * from './mutation-observer.service';
