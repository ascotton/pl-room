import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { PLButtonModule,
    PLDotLoaderModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { PLDocumentationClientsComponent } from './pl-documentation-clients.component';
import { PLDocumentationClientComponent } from './pl-documentation-client/pl-documentation-client.component';
import { PLDocumentationMetricsComponent } from './pl-documentation-metrics/pl-documentation-metrics.component';
import { PLDocumentationMetricPointComponent } from './pl-documentation-metric-point/pl-documentation-metric-point.component';
import { PLDocumentationNotesComponent } from './pl-documentation-notes/pl-documentation-notes.component';
import { PLRoomDocumentationService } from './pl-room-documentation.service';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        PLButtonModule,
        PLDotLoaderModule,
        PLIconModule,
        PLInputModule,
    ],
    exports: [
        PLDocumentationClientsComponent,
        PLDocumentationClientComponent,
        PLDocumentationMetricsComponent,
        PLDocumentationMetricPointComponent,
        PLDocumentationNotesComponent,
    ],
    declarations: [
        PLDocumentationClientsComponent,
        PLDocumentationClientComponent,
        PLDocumentationMetricsComponent,
        PLDocumentationMetricPointComponent,
        PLDocumentationNotesComponent,
    ],
    providers: [PLRoomDocumentationService],
})
export class PLDocumentationClientsModule {}

export { PLDocumentationClientsComponent } from './pl-documentation-clients.component';
