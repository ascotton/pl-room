import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { PLWidgetsBoardModelService } from '../pl-widgets-board/pl-widgets-board-model.service';
import { PLWidgetsOverlayService } from './pl-widgets-overlay.service';

@Component({
    selector: 'pl-widgets-overlay',
    templateUrl: './pl-widgets-overlay.component.html',
    styleUrls: ['./pl-widgets-overlay.component.less'],
})
export class PLWidgetsOverlayComponent implements OnDestroy {
    scaledRef: Subscription;
    activatedRef: Subscription;
    scalingValue: number;
    widgets = [];
    isActive = false;
    @ViewChild('dropZone', { static: false }) dropzone: ElementRef;
    mousemove$: any;
    mouseMoveSub: Subscription;
    lastX = 0;
    lastY = 0;

    constructor(
        private widgetsOverlayModel: PLWidgetsOverlayService,
        private widgetsBoardModel: PLWidgetsBoardModelService,
    ) {
        this.scaledRef = this.widgetsOverlayModel.scaled$.subscribe((scalingValue) => this.scalingValue = scalingValue);
        this.activatedRef = this.widgetsOverlayModel.activated$.subscribe(
            (activated) => {
                this.isActive = activated;
                if (activated) {
                    this.mousemove$ = fromEvent(this.dropzone.nativeElement, 'mousemove');
                    this.mouseMoveSub = this.mousemove$.subscribe(evt => {
                        const { x, y } = this.dropzone.nativeElement.getBoundingClientRect();
                        this.lastX = evt.clientX - x;
                        this.lastY = evt.clientY - y;
                    });
                } else {
                    if (this.mouseMoveSub) {
                        this.mouseMoveSub.unsubscribe();
                    }
                }
            }
        );

    }

    ngOnDestroy() {
        this.scaledRef.unsubscribe();
    }

    getWidth() {
        return this.widgetsBoardModel.width;
    }

    dropCallback(dropEvent: any) {
        const widgetData = dropEvent.previousContainer.data[dropEvent.previousIndex];
        this.widgetsBoardModel.createWidget(widgetData, this.lastX, this.lastY, this.getWidth());
        this.widgetsOverlayModel.deactivate();
    }
    cancelDrag() {
        this.widgetsOverlayModel.deactivate();
    }

}
