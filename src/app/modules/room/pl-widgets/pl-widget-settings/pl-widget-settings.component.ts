
import { Component, Input } from '@angular/core';

import { PLWidgetsOverlayService } from '../../pl-widgets/pl-widgets-overlay/pl-widgets-overlay.service';
import { PLWidgetsService } from '../../pl-widgets/pl-widgets.service';
import { PLDiceParams, PLWidget } from '../../pl-widgets/pl-widget.model';
import { PLWidgetsBoardModelService } from '../../pl-widgets/pl-widgets-board/pl-widgets-board-model.service';

@Component({
    selector: 'pl-widget-settings',
    templateUrl: './pl-widget-settings.component.html',
    styleUrls: ['./pl-widget-settings.component.less'],
})
export class PLWidgetSettingsComponent {
    @Input() widget: PLWidget;
    private changeTimer = null;
    activeWidgets: PLWidget[];

    constructor (
        private widgetsBoardModel: PLWidgetsBoardModelService) {
        this.activeWidgets = widgetsBoardModel.getWidgets();
    }

    paramsChanged(value) {
        if (this.changeTimer) {
            clearTimeout(this.changeTimer);
        }
        this.changeTimer = setTimeout(() => {
            const widget = { ...this.widget };
            widget.params = { ...value };

            const index = this.activeWidgets.findIndex(w => w.$id === widget.$id);
            this.activeWidgets[index] = widget;

            this.changeTimer = null;
        },                            200);
    }
}