import { Injectable } from '@angular/core';
import { TimerWidgetConfig } from './pl-timer-widget-config.constant';

@Injectable()
export class PLTimerWidgetTimeService {

    timeServiceConfig: any;

    constructor() {
        this.timeServiceConfig = TimerWidgetConfig.timeService;
    }

    calcOverallTime(currentTime, start, overallTime) {
        let resTime = overallTime;
        if (!overallTime) {
            resTime = 0;
        }
        resTime += currentTime - start;
        return this.roundMSeconds(resTime);
    }

    calcTime(currentTime, startTime, overallTime) {
        let resTime = overallTime;
        if (!overallTime) {
            resTime = 0;
        }
        return this.roundMSeconds(currentTime - startTime + resTime);
    }

    roundMSeconds(time) {
        return time - (time % this.timeServiceConfig.mSecInSecond);
    }

    calcDiffTime(defaultTime, time) {
        return Math.ceil((defaultTime - time) / this.timeServiceConfig.mSecInSecond);
    }

    calcDefaultTime(minutes, seconds) {
        const defaultTime =  (seconds + minutes * this.timeServiceConfig.minutesInHour) *
            this.timeServiceConfig.mSecInSecond;
        return defaultTime > this.timeServiceConfig.maxTime ? this.timeServiceConfig.maxTime : defaultTime;
    }

    getMinutes(time = 0) {
        return (time / this.timeServiceConfig.minutesInHour) | 0;
    }

    getSeconds(time = 0) {
        const minutes = this.getMinutes(time);
        return (time - minutes * this.timeServiceConfig.minutesInHour) | 0;
    }

}
