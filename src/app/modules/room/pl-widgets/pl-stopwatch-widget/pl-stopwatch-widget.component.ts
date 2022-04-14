
import { Component, EventEmitter, Input, NgZone, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { PLWidget } from '../pl-widget.model';
import { PLWidgetsBoardModelService } from '../pl-widgets-board/pl-widgets-board-model.service';

const STATUS = {
    INITIAL: 'initial',
    RUNNING: 'running',
    SUSPENDED: 'suspended',
};
@Component({
    selector: 'pl-stopwatch-widget',
    templateUrl: './pl-stopwatch-widget.component.html',
    styleUrls: ['./pl-stopwatch-widget.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLStopwatchWidgetComponent implements OnChanges {

    @Input() params: any;
    @Input() dragging = false;
    @Output() changed: EventEmitter<void> = new EventEmitter();

    start = 0;
    overallTime = 0;
    intervalIds = [];
    status = STATUS.INITIAL;
    time = 0;
    reachedLimit = false;

    constructor (private widgetsBoardModel: PLWidgetsBoardModelService,
                 private currentUserModel: CurrentUserModel,
                 private zone: NgZone) {}

    isClinitian() {
        return this.currentUserModel.user.isClinicianOrExternalProvider();
    }

    getCurrentTime = () => {
        return this.widgetsBoardModel.getFirebaseTime();
    }

    ngOnChanges(changes: SimpleChanges) {
        const paramsChange = changes['params'];
        if (paramsChange && paramsChange.currentValue && paramsChange.previousValue !== paramsChange.currentValue) {
            this.status = this.params.status || STATUS.INITIAL;
            this.overallTime = parseInt(this.params.overallTime, 10) || 0;
            this.start = parseInt(this.params.start, 10) || 0;

            this.reachedLimit = this.isTimeElapsed(this.overallTime);

            this.countTime();
            this.checkStatus();
        }
    }

    ngOnDestroy() {
        this.killInterval();
    }

    updateFbParams = () => {
        this.params.start = this.start;
        this.params.overallTime = this.overallTime;
        this.params.status = this.status;
        this.changed.emit();
    }

    getMilisLeft = (time: number) => {
        if (!time) {
            return 0;
        }
        return time - ((time / 1000) || 0) * 1000;
    }

    startInterval = () => {
        if (!this.time) {
            this.intervalIds.push(setInterval(this.countTime, 1000));
        } else {
            this.intervalIds.push(setTimeout(this.gotoSecondAndStartInterval, 1000 - this.getMilisLeft(this.time)));
        }
    }

    killInterval = () => {
        if (!this.intervalIds || !this.intervalIds.length) {
            return;
        }
        this.intervalIds.forEach((intervalId) => {
            if (intervalId.$$timeoutId) {
                clearTimeout(intervalId);
            } else if (intervalId.$$intervalId) {
                clearInterval(intervalId);
            }
        });
    }

    startStopwatch = (force = false) => {
        if (this.status !== STATUS.RUNNING || force) {
            if (!force) {
                this.start = this.getCurrentTime();
            }
            if (!this.overallTime) {
                this.overallTime = 0;
            }
            this.status = STATUS.RUNNING;
            this.startInterval();
            if (!force) {
                this.updateFbParams();
            }
        }
    }

    stopStopwatch = (force = false) => {
        if (this.dragging) {
            return;
        }
        if (this.status !== STATUS.SUSPENDED || force) {
            this.status = STATUS.SUSPENDED;
            this.killInterval();
            if (!force) {
                this.overallTime += this.getCurrentTime() - this.start;
                this.start = 0;
                this.updateFbParams();
            } else {
                this.start = 0;
            }
            this.countTime();
        }
    }

    resetStopwatch = (force = false) =>  {
        if (this.dragging) {
            return;
        }
        this.reachedLimit = false;
        if (this.status !== STATUS.INITIAL || force) {
            this.start = null;
            this.overallTime = 0;
            this.time = 0;
            this.status = STATUS.INITIAL;
            this.killInterval();
            if (!force) {
                this.updateFbParams();
            }
        }
    }

    gotoSecondAndStartInterval = () =>  {
        this.countTime();
        this.intervalIds.push(setInterval(this.countTime, 1000));
    }

    countTime = () => {
        if (this.status !== STATUS.RUNNING) {
            this.killInterval();
        }
        this.start = this.start || 0;
        this.overallTime = parseInt((<any>this.overallTime), 10) || 0;
        const diff = this.start ? this.getCurrentTime() - this.start : 0;
        const time = Math.round((diff + this.overallTime) / 1000) * 1000 ;

        this.zone.run(() => this.time = time);

        if (this.isTimeElapsed(time)) {
            this.reachedLimit = true;
            this.stopStopwatch(false);
        }
    }

    isTimeElapsed = (time: number) =>  {
        return time / 1000 >= (59 * 60 + 59);
    }

    checkStatus = () => {
        switch (this.params.status) {
                case STATUS.RUNNING:
                    this.startStopwatch(true);
                    break;
                case STATUS.SUSPENDED:
                    this.stopStopwatch(true);
                    break;
                case STATUS.INITIAL:
                    this.resetStopwatch(true);
                    break;
        }
    }

}
