import { Component } from '@angular/core';

import { PLWidgetsOverlayService } from '@room/pl-widgets/pl-widgets-overlay/pl-widgets-overlay.service';
import { PLWidgetsService } from '@room/pl-widgets/pl-widgets.service';
import { PLWidget } from '@room/pl-widgets/pl-widget.model';
@Component({
    selector: 'pl-widgets-dialog',
    templateUrl: 'pl-widgets-dialog.component.html',
    styleUrls: ['./pl-widgets-dialog.component.less'],
})
export class PLWidgetsDialogComponent {
    widgets: PLWidget[];

    constructor(
                widgetsService: PLWidgetsService,
                private widgetsOverlayModel: PLWidgetsOverlayService) {
        this.widgets = widgetsService.getWidgets();
    }

    // Event firing after start dragging widget from drawer
    startDrag(event) {
        this.widgetsOverlayModel.activate();
        return false;
    }

    // Event firing after we drop element not in widget layer
    cancelDrag() {
        this.widgetsOverlayModel.deactivate();
        return false;
    }
}
