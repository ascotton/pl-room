import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLSessionRecordDrawerControlsComponent } from './pl-session-record-controls.component';

import { PLCommonComponentsModule } from '@common/components';

import { PLApiBillingCodesService, PLApiAbstractService } from '@lib-components/api/';
import { PLGQLClientsService } from '@lib-components/api-graph-ql';

import { PLButtonModule,
    PLDotLoaderModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';
import { PLSessionPreviewComponent } from './pl-session-preview.component';

@NgModule({
    imports: [
        CommonModule,
        PLCommonComponentsModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLIconModule,
        PLInputModule,
    ],
    exports: [PLSessionRecordDrawerControlsComponent],
    declarations: [PLSessionPreviewComponent, PLSessionRecordDrawerControlsComponent],
    providers: [PLApiBillingCodesService, PLApiAbstractService, PLGQLClientsService],
})
export class PLSessionRecordModule {}

export { PLSessionRecordDrawerControlsComponent } from './pl-session-record-controls.component';
