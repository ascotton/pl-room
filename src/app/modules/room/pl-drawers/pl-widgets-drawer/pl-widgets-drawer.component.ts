import { Component, Input, ViewEncapsulation } from '@angular/core';
import { map, merge } from 'lodash';
import { PLWidgetsOverlayService } from '../../pl-widgets/pl-widgets-overlay/pl-widgets-overlay.service';
import { PLWidgetsService } from '../../pl-widgets/pl-widgets.service';
import { PLDiceParams, PLWidget } from '../../pl-widgets/pl-widget.model';
import { PLWidgetsBoardModelService } from '../../pl-widgets/pl-widgets-board/pl-widgets-board-model.service';

@Component({
    selector: 'pl-widgets-drawer',
    templateUrl: './pl-widgets-drawer.component.html',
    styleUrls: ['./pl-widgets-drawer.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLWidgetsDrawerComponent {
    @Input() active = false;
    widgets: PLWidget[];
    activeWidgets: PLWidget[];
    currentWidget: number = null;
    customizingWidget = false;
    private changeTimer = null;

    constructor (
        widgetsService: PLWidgetsService,
        private widgetsBoardModel: PLWidgetsBoardModelService,
        private widgetsOverlayModel: PLWidgetsOverlayService,
    ) {
        this.widgets = widgetsService.getWidgets();
        this.activeWidgets = widgetsBoardModel.getWidgets();
        this.currentWidget = null;
    }

    setCurrentWidget(index: number) {
        this.currentWidget = index;
        if (this.currentWidget !== null) {
            map(this.activeWidgets, (element) => {
                return merge(element, { clicked: false, added: false });
            });

            this.activeWidgets[index].clicked = true;

            setTimeout(() => {
                this.activeWidgets[index].clicked = false;
            },         1000);
        }
    }

    // Event firing after start dragging widget from drawer
    startDrag(event: DragEvent) {
        if (event.which !== 1) {
            return;
        }

        this.widgetsOverlayModel.activate();
    }

    // Event firing after we drop element not in widget layer
    cancelDrag() {
        this.widgetsOverlayModel.deactivate();
        return true;
    }

    deleteWidgetByIndex(widget, index) {
        if (index === this.currentWidget) {
            this.currentWidget = null;
        } else if (index < this.currentWidget) {
            this.currentWidget--;
        }
        this.widgetsBoardModel.deleteWidgetById(widget.$id);
    }

    paramChanged(value, param, index) {
        if (this.changeTimer) {
            clearTimeout(this.changeTimer);
        }
        this.changeTimer = setTimeout(() => {
            const widget = { ...this.activeWidgets[index] };
            widget.params = { ...widget.params };
            widget.params[param] = value;
            this.activeWidgets[index] = widget;
            this.changeTimer = null;
        },                            200);
    }

    paramsChanged(value, index) {
        if (this.changeTimer) {
            clearTimeout(this.changeTimer);
        }
        this.changeTimer = setTimeout(() => {
            const widget = { ...this.activeWidgets[index] };
            widget.params = { ...value };
            this.activeWidgets[index] = widget;
            this.changeTimer = null;
        },                            200);
    }

    getId(index, item) {
        return item.$id;
    }

    onCustomize() {
        this.customizingWidget = true;
    }

    onDoneCustomize() {
        this.customizingWidget = false;
    }

    onDiceSidesChanged(sides: string[], index: number) {
        const widget: PLWidget = this.activeWidgets[index];
        const params: PLDiceParams = widget.params;

        if (params.numberOfSides > sides.length) {
            params.dice = params.dice.map((_el, i) => 1 + (i % sides.length));
        }
        params.numberOfSides = sides.length;
        params.selectedSides = sides;
        this.paramsChanged(params, index);
    }
}
