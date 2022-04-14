import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, OnDestroy, NgZone } from '@angular/core';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { find } from 'lodash';
import { Subscription } from 'rxjs';
import { PLWidget } from '../pl-widget.model';
import { PLWidgetsBoardModelService } from '../pl-widgets-board/pl-widgets-board-model.service';

import {OverlayContainer} from "@angular/cdk/overlay";

@Component({
    selector: 'pl-base-widget',
    templateUrl: './pl-base-widget.component.html',
    styleUrls: ['./pl-base-widget.component.less'],
})
export class PLBaseWidgetComponent implements OnInit, OnChanges, OnDestroy {
    @Input() widget: PLWidget;
    private element: HTMLElement;
    private isScaleAction = false;
    private animated_top_x = 0;
    private animated_top_y = 0;
    private scaleChangedRef: Subscription = null;
    isStudentOrObserver = false;
    moved = false;
    r_scale = 1;
    left = 0;
    top = 0;
    dragging = false;

    constructor(private currentUserModel: CurrentUserModel,
                private widgetsBoardModel: PLWidgetsBoardModelService,
                private templateElement: ElementRef,
                private zone: NgZone,
                private overlayContainer: OverlayContainer) {
        this.isStudentOrObserver = currentUserModel.user.isInGroup('student') ||
        currentUserModel.user.isInGroup('Observer');

    }

    ngOnInit() {
        this.scaleChangedRef = this.widgetsBoardModel.scaleChanged$.subscribe(() => {
            const width = this.widgetsBoardModel.getWidth();
            this.zone.run(() => {
                this.scaleWidget(width);
            });
        });
        this.element = this.templateElement.nativeElement.querySelector('.widget');
        this.createWidget(); // for sync
    }

    ngOnChanges(changes: SimpleChanges) {
        const widgetChange = changes['widget'];
        if (widgetChange && widgetChange.currentValue && this.element) {
            if (this.isSecondary()) {
                this.animateMoveTo(this.widget.top_x, this.widget.top_y);
                return;
            }
            const oldWidget = widgetChange.previousValue;
            const newWidget = widgetChange.currentValue;
            const isPositionChanged = !oldWidget || oldWidget.initial_top_x !== newWidget.initial_top_x ||
                oldWidget.initial_top_y !== newWidget.initial_top_y;

            if (isPositionChanged && !this.widget.scaled) {
                this.syncPosition(this.widget.initial_top_x, this.widget.initial_top_y);
                this.widget.scaled = false;
            }
            this.widget.hidden = newWidget.hidden;
        }
    }

    ngOnDestroy() {
        this.scaleChangedRef.unsubscribe();
    }

    deleteMe() {
        this.widgetsBoardModel.deleteWidgetById(this.widget.$id);
    }

    showSettings() {

    }

    isSecondary = () => {
        return !this.currentUserModel.user.isClinicianOrExternalProvider();
    }

    makeSync() {
        this.widgetsBoardModel.syncWidget(this.widget);
    }

    private pushWidgetToFront() {
        const widgets = this.widgetsBoardModel.getWidgets();
        const copy = [ ...widgets ];
        copy.sort((a, b) => {
            if (a.$id === this.widget.$id) {
                return -1;
            }
            if (b.$id === this.widget.$id) {
                return 1;
            }
            return b.zIndex - a.zIndex;
        }).forEach((w, i) => {
            (<any>find(widgets, { $id: w.$id })).zIndex = widgets.length - i;
        });
    }

    startDrag() {
        this.pushWidgetToFront();
        this.dragging = true;
    }

    dropped(event: CdkDragEnd<any>) {
        event.source._dragRef.reset();
        const top_x = this.widget.top_x + event.distance.x;
        const top_y = this.widget.top_y + event.distance.y;
        // Move widget to new position
        this.moveTo(top_x, top_y);
        this.widgetsBoardModel.syncWidgets();
        this.pushWhiteboardToFront();
        setTimeout(() => {
            this.dragging = false;
        },         10);
    }

    scaleWidget = (width: number) => {
        if (this.boardReady() && this.element) {
            // so mark that we are in scale action now
            this.isScaleAction = true;

            const normalWidth = 1024;
            const scale_to_normal = width / normalWidth;
            const scale_to_initial = width / this.widget.initial_width;
            const scaledLeft = this.widget.initial_top_x * scale_to_initial;
            const scaledTop = this.widget.initial_top_y * scale_to_initial;
            const left = this.getLimitedLeft(scaledLeft - this.element.clientWidth / 2, true);
            const top = this.getLimitedTop(scaledTop - this.element.clientHeight / 2, true);

            this.r_scale = Math.round(scale_to_normal * 100) / 100;
            this.left = left;
            this.top = top;
            this.widget.top_x = left;
            this.widget.top_y = top;
            this.widget.initial_top_x = (left + this.element.clientWidth / 2);
            this.widget.initial_top_y = (top + this.element.clientHeight / 2);
            this.widget.initial_width = width;
            this.widget.scaled = true;
            // Widget starts hidden while positioning itself to avoid brief "jump". Now that in the correct
            // position, re-show, after a brief buffer timeout.
            setTimeout(() => {
                this.widget.opacity = 1;
            },         100);
            if (this.isSecondary()) {
                this.moved = true;
                setTimeout(() => {
                    this.moved = false;
                },         105);
            }
        }
    }

    // On initialize, the height is small, so skip.
    boardReady() {
        const boardHeight = this.widgetsBoardModel.getHeight();
        return boardHeight > 100;
    }

    showAdded() {
        this.widget.added = true;
        setTimeout(() => {
            this.widget.added = false;
        },         1000);
    }

    pushWhiteboardToFront() {
        // TODO: Change this to another ng2 approach when whiteboard gets migrated
        const newIndex =  50 + this.widgetsBoardModel.getWidgets().length;
        $('.whiteboard-container').css('z-index', newIndex);
    }

    createWidget () {
        this.widgetsBoardModel.changed = true;
        this.pushWhiteboardToFront();
        this.showAdded();
    }

    getScaleToInitial() {
        return this.widgetsBoardModel.getWidth() / this.widget.initial_width;
    }

    getConvertedLeft() {
        const scaledLeft = this.widget.initial_top_x * this.getScaleToInitial();
        return this.getLimitedLeft(scaledLeft - this.element.clientWidth / 2, false);
    }

    getConvertedTop() {
        const scaledTop = this.widget.initial_top_y * this.getScaleToInitial();
        return this.getLimitedTop(scaledTop - this.element.clientHeight / 2, false);
    }

    animateMoveTo(top_x: number, top_y: number) {
        // set isScaleAction to false no matter what temporarily for now. it is not behaving right.
        // JB - 10/24/2018
        this.isScaleAction = false;

        if ((this.animated_top_x === top_x &&
            this.animated_top_y === top_y) ||
            !this.isSecondary() || this.isScaleAction
        ) {
            return;
        }

        this.animated_top_x = this.getConvertedLeft();
        this.animated_top_y = this.getConvertedTop();

        const elementTopX = this.left;
        const elementTopY = this.top;
        if (this.animated_top_x ===  elementTopX && this.animated_top_y === elementTopY) {
            return;
        }

        this.moved = true;
        setTimeout(() => {
            this.moved = false;
        },         105);
    }

    getConvertedScale() {
        const normalWidth = 1024;
        const initial_scale = this.widget.initial_width / normalWidth;
        const current_scale = this.widgetsBoardModel.getWidth() / normalWidth;

        return current_scale / initial_scale;
    }

    getLimitedLeft(left: number, not_round: boolean) {
        let res = left;
        const width = this.element.clientWidth;
        const scale_to_normal = this.widgetsBoardModel.getWidth() / 1024;
        const half_of_box = width / 2;
        const widthWithScale = width * scale_to_normal;
        const scaled_radius = half_of_box * scale_to_normal;
        const right_limit = this.widgetsBoardModel.getWidth() - half_of_box + scaled_radius - widthWithScale;
        const left_limit = -half_of_box - scaled_radius + widthWithScale;

        if (left <= left_limit) {
            res = left_limit;
        } else if (left >= right_limit) {
            res = right_limit;
        }

        return not_round ? res : Math.round(res);
    }

    getLimitedTop(top: number, not_round: boolean) {
        let res = top;
        const height = this.element.clientHeight;
        const scale_to_normal = this.widgetsBoardModel.getWidth() / 1024;
        const half_of_box = height / 2;
        const scaled_radius = half_of_box * scale_to_normal;
        const bottom_limit = this.widgetsBoardModel.getHeight() -
            half_of_box + scaled_radius - height * scale_to_normal;
        const top_limit = -half_of_box - scaled_radius + height * scale_to_normal;

        if (top < top_limit) {
            res = top_limit;
        } else if (top >= bottom_limit) {
            res = bottom_limit;
        }

        return not_round ? res : Math.round(res);
    }

    moveTo = (left: number, top: number) => {
        const newTop = this.getLimitedTop(top, false);
        const newLeft = this.getLimitedLeft(left, false);
        this.left = Math.round(newLeft);
        this.top = Math.round(newTop);

        const scale_to_initial = this.widgetsBoardModel.getWidth() / this.widget.initial_width;

        this.widget.top_x = newLeft;
        this.widget.top_y = newTop;
        this.widget.initial_top_x = (newLeft + this.element.clientWidth / 2) / scale_to_initial;
        this.widget.initial_top_y = (newTop + this.element.clientHeight / 2) / scale_to_initial;

    }

    syncPosition = (left: number, top: number) => {
        if (!this.element) {
            return;
        }
        const scale_to_initial = this.widgetsBoardModel.getWidth() / this.widget.initial_width;

        const newLeft = this.getLimitedLeft(left * scale_to_initial - this.element.clientWidth / 2, false);
        const newTop = this.getLimitedTop(top * scale_to_initial - this.element.clientHeight / 2, false);

        this.animated_top_x = Math.round(newLeft);
        this.animated_top_y = Math.round(top);
        const elementX = this.left;
        const elementY = this.top;
        if (this.animated_top_x ===  elementX && this.animated_top_y === elementY) {
            return;
        }

        this.widget.top_x = newLeft;
        this.widget.top_y = newTop;

        this.moved = true;
        setTimeout(() => {
            this.moved = false;
        },         105);
    }

}
