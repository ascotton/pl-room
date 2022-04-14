import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TimerWidgetConfig } from './pl-timer-widget-config.constant';

@Injectable()
export class PLTimerWidgetIntervalService {
    private intervalTickSource = new BehaviorSubject<number>(0);
    intervalTick$ = this.intervalTickSource.asObservable();
    intervalId: NodeJS.Timeout;
    tickTime = 0;

    constructor() {
        this.tickTime = TimerWidgetConfig.interval.defaultTick;
    }

    start() {
        if (this.intervalId) {
            return this;
        }
        this.intervalId = setInterval(() => this.tick(0), this.tickTime);
        return this;
    }

    reset() {
        this.stop();
    }

    stop() {
        if (!this.intervalId) {
            return this;
        }
        clearInterval(this.intervalId);
        this.intervalId = null;
        return this;
    }

    private tick(countOfTicks: number) {
        const nextTick = countOfTicks + 1;
        this.intervalTickSource.next(nextTick);
    }

}
