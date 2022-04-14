import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { PLTimerWidgetModelService } from '../pl-timer-widget-model.service';
import { TimerWidgetConfig } from '../pl-timer-widget-config.constant';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-timer-widget-digits',
    templateUrl: 'pl-timer-widget-digits.component.html',
    styleUrls: ['pl-timer-widget-digits.component.less'],
    encapsulation: ViewEncapsulation.None,
})

export class PLTimerWidgetDigitsComponent implements OnInit, OnDestroy {
    @Input() dragging = false;
    needToPlayShakeAnimation = false;
    isHideMinutes = false;
    isShowOnlyOneDigit = false;
    editingMode = '';
    minutes1 = 0;
    minutes2 = 0;
    minutesLabel = '';
    seconds1 = 0;
    seconds2 = 0;
    digitInserted = 0;
    changedRef: Subscription = null;

    constructor(private currentUserModel: CurrentUserModel,
                private timerWidgetModel: PLTimerWidgetModelService) {
        this.changedRef = this.timerWidgetModel.changed$.subscribe(() => this.changed());
    }

    ngOnInit() {
        this.changed();
    }

    ngOnDestroy() {
        this.changedRef.unsubscribe();
    }

    changed = () => {
        const state = this.timerWidgetModel.getState();
        const labels = state.labels;
        const min1 = (labels.minutes / 10) | 0;
        const min2 = labels.minutes % 10;
        const isMinutesZero = state.labels.minutes === 0;
        const isStatusRunning = state.status === TimerWidgetConfig.state.status.running;
        const isRunningAndMinutesZero = isMinutesZero && isStatusRunning;

        this.minutes1 = min1 ? min1 : null;
        if (this.minutes1 === null && !min2) {
            this.minutes2 = null;
        } else {
            this.minutes2 = min2;
        }
        this.minutesLabel = labels.minutes ? 'm' : '';
        this.seconds1 = (labels.seconds / 10) | 0;
        this.seconds2 = labels.seconds % 10;

        this.editingMode = state.editingMode;
        this.digitInserted = state.digitInserted;
        this.isHideMinutes = isRunningAndMinutesZero && state.labels.seconds > 0 ;
        this.isShowOnlyOneDigit = isRunningAndMinutesZero && state.labels.seconds < 10;

        if (state.isStop) {
            this.startEndAnimation();
        }
    }

    startEndAnimation() {
        this.needToPlayShakeAnimation = true;
        setTimeout(() => {
            this.needToPlayShakeAnimation = false;
        },         1000);
    }

    prepareToChanges = () => {
        this.timerWidgetModel.turnOnEditMode(null);
        const state = this.timerWidgetModel.getState();
        this.editingMode = state.editingMode;
    }

    isClinitian() {
        return this.currentUserModel.user.isClinicianOrExternalProvider();
    }
}
