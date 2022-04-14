import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { PLTimerWidgetIntervalService } from './pl-timer-widget-interval.service';
import { PLTimerWidgetModelService } from './pl-timer-widget-model.service';
import { PLTimerWidgetTimeService } from './pl-timer-widget-time.service';
import { TimerWidgetConfig } from './pl-timer-widget-config.constant';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-timer-widget',
    templateUrl: './pl-timer-widget.component.html',
    styleUrls: ['./pl-timer-widget.component.less'],
    providers: [PLTimerWidgetModelService, PLTimerWidgetIntervalService],
    encapsulation: ViewEncapsulation.None,
})
export class PLTimerWidgetComponent implements OnChanges, OnInit, OnDestroy {

    @Input() params: any;
    @Input() dragging = false;
    @Output() changed: EventEmitter<void> = new EventEmitter();
    private subscriptions: Subscription[] = [];

    constructor(private timerWidgetModel: PLTimerWidgetModelService,
                private timerWidgetInterval: PLTimerWidgetIntervalService,
                private currentUserModel: CurrentUserModel) {
        this.subscriptions.push(
            this.timerWidgetInterval.intervalTick$.subscribe(() => {
                const isStop = this.timerWidgetModel.decreaseTick();
                if (isStop) {
                    this.timerWidgetInterval.stop();
                    this.timerWidgetModel.timerEnd();
                }
            }),
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        const paramsChange = changes['params'];
        if (paramsChange && paramsChange.currentValue && paramsChange.previousValue !== paramsChange.currentValue) {
            if (this.isClinitian()) {
                this.subscriptions.push(
                    this.timerWidgetModel.sync$.subscribe(() => this.updateFbParams()),
                );
            }
            this.timerWidgetModel.setAudioEnabled(this.params.audioEnabled);
            if (paramsChange.isFirstChange() || this.params.status !== this.timerWidgetModel.getStatus()) {
                this.timerWidgetModel.setDefaultData(this.params);
                this.checkStatus();
            }
        }
    }

    ngOnInit() {
        this.checkStatus();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => {
            s.unsubscribe();
        });
    }

    updateFbParams() {
        if (this.isClinitian()) {
            const state = this.timerWidgetModel.getState();
            this.params.status = state.status;
            const stateTime = state.stateTime;
            this.params.defaultTime = stateTime.defaultTime;
            this.params.start = stateTime.start;
            this.params.overallTime = stateTime.overall;
            this.changed.emit();
        }
    }

    init = () => {
        this.timerWidgetModel.setDefaultData(this.params);
        this.checkStatus();
    }

    onDelete = () => {
        this.timerWidgetModel.stop(true);
        this.timerWidgetInterval.stop();
    }

    private checkStatus() {
        const statusConfig = TimerWidgetConfig.state.status;
        switch (this.timerWidgetModel.getStatus()) {
                case statusConfig.initial:
                    this.timerWidgetModel.reset(true);
                    this.timerWidgetInterval.reset();
                    break;
                case statusConfig.running:
                    if (this.timerWidgetModel.start(true)) {
                        this.timerWidgetInterval.start();
                    }
                    break;
                case statusConfig.suspended:
                    this.timerWidgetModel.stop(true);
                    this.timerWidgetInterval.stop();
                    break;
        }
    }

    isClinitian() {
        return this.currentUserModel.user.isClinicianOrExternalProvider();
    }

    start = () => {
        if (!this.timerWidgetModel.start(null)) {
            return;
        }
        this.timerWidgetInterval.start();
    }

    stop = () => {
        this.timerWidgetModel.stop(null);
        this.timerWidgetInterval.stop();
    }

    reset = () => {
        this.timerWidgetModel.reset(null);
        this.timerWidgetInterval.reset();
    }

    get status() {
        return this.timerWidgetModel.getStatus();
    }

}
