import { Injectable, NgZone } from '@angular/core';
import { PLTimerWidgetTimeService } from './pl-timer-widget-time.service';
import { TimerWidgetConfig } from './pl-timer-widget-config.constant';
import { PLWidgetsBoardModelService } from '../pl-widgets-board/pl-widgets-board-model.service';
import { Subject } from 'rxjs';

@Injectable()
export class PLTimerWidgetModelService {
    private syncSource = new Subject<void>();
    private changedSource = new Subject<void>();
    sync$ = this.syncSource.asObservable();
    changed$ = this.changedSource.asObservable();
    audioTimerEnd: HTMLAudioElement;
    statusConfig;
    state;

    constructor(private widgetsBoardModel: PLWidgetsBoardModelService,
                private timerWidgetTimeService: PLTimerWidgetTimeService,
                private zone: NgZone) {
        this.statusConfig = TimerWidgetConfig.state.status;
        this.state = {
            audioEnabled: false,
            isRunAudio: false,
            isStop: false,
            editingMode: TimerWidgetConfig.state.editModes.none,
            status: this.statusConfig.initial,
            stateTime: {
                start: 0,
                time: 0,
                overall: 0,
                defaultTime: 10000,
                previousDefaultTime: 10000,
            },
            labels: {
                minutes: 0,
                seconds: 0,
            },
            digitInserted: 0,
        };
        this.audioTimerEnd = new Audio('/assets/audio/oxygen.mp3');
    }

    private syncData() {
        this.syncSource.next();
    }

    getState() {
        return this.state;
    }

    getStatus() {
        return this.state.status;
    }

    getLabels() {
        return this.state.labels;
    }

    setAudioEnabled(newAudioEnabled) {
        this.state.audioEnabled = newAudioEnabled;
        return this;
    }

    setDefaultData(params) {
        this.state.status = params.status;
        this.state.audioEnabled = params.audioEnabled;
        const stateTime = this.state.stateTime;
        stateTime.defaultTime = parseInt(params.defaultTime, 10) || stateTime.defaultTime;
        stateTime.start = parseInt(params.start, 10) || stateTime.start;
        stateTime.overall = parseInt(params.overallTime, 10) || 0;
        stateTime.time = stateTime.overall ? stateTime.overall : 0;
        this.triggerOnchange();
    }

    turnOnEditMode(type) {
        if (this.state.status !== this.statusConfig.initial && this.state.status !== this.statusConfig.suspended) {
            return this;
        }
        if (type === TimerWidgetConfig.state.editModes.minutes && this.state.digitInserted < 2) {
            return this;
        }
        this.state.editingMode = type ? type : TimerWidgetConfig.state.editModes.seconds;
        return this;
    }

    triggerOnchange() {
        this.calcLabels();
        this.changedSource.next();
    }

    start(isNotSync) {
        if (this.state.stateTime.defaultTime <= 0 || (!this.state.labels.minutes && !this.state.labels.seconds)) {
            this.reset(false);
            return false;
        }
        if (this.state.stateTime.defaultTime !== this.state.stateTime.previousDefaultTime) {
            this.state.stateTime.previousDefaultTime = this.state.stateTime.defaultTime;
        }
        this.state.editingMode = TimerWidgetConfig.state.editModes.running;
        this.state.isStop = false;
        if (!isNotSync) {
            this.state.stateTime.start = this.getCurrentTime();
        }
        this.state.status = this.statusConfig.running;
        this.decreaseTick();
        if (!isNotSync) {
            this.syncData();
        }
        this.triggerOnchange();
        return true;
    }

    stop(isNotSync) {
        this.state.status = this.statusConfig.suspended;
        this.state.isStop = false;
        this.state.editingMode = TimerWidgetConfig.state.editModes.none;
        if (!isNotSync) {
            this.state.stateTime.overall = this.timerWidgetTimeService.calcOverallTime(this.getCurrentTime(),
                                                                                       this.state.stateTime.start,
                                                                                       this.state.stateTime.overall);
            this.syncData();
        }
        this.triggerOnchange();
        return this;
    }

    private resetTime() {
        this.state.stateTime.overall = 0;
        this.state.stateTime.time = 0;
        this.state.stateTime.start = 0;
        if (!this.state.stateTime.defaultTime) {
            this.state.stateTime.defaultTime = this.state.stateTime.previousDefaultTime;
        }
        this.state.status = this.statusConfig.initial;
    }

    reset(isNotSync) {
        this.resetTime();
        this.state.editingMode = TimerWidgetConfig.state.editModes.none;
        if (!isNotSync) {
            this.syncData();
        }
        this.triggerOnchange();
        this.state.isStop = false;
        this.state.isRunAudio = false;
        return this;
    }

    timerEnd() {
        this.state.isStop = true;
        this.state.isRunAudio = this.state.audioEnabled;
        if (this.state.audioEnabled) {
            this.audioTimerEnd.play();
        }
        this.reset(false);
    }

    decreaseTick() {
        if (this.state.status !== this.statusConfig.running) {
            return true;
        }

        const timeLeft = this.timerWidgetTimeService.calcTime(this.getCurrentTime(),
                                                              this.state.stateTime.start,
                                                              this.state.stateTime.overall);
        this.zone.run(() => this.state.stateTime.time = timeLeft);
        this.triggerOnchange();
        return this.isStop();
    }

    isStop () {
        const isTimeOff = this.state.stateTime.defaultTime - this.state.stateTime.time < 0;
        const isTimeEnd = this.state.labels.minutes === 0 && this.state.labels.seconds === 0;
        return isTimeEnd || isTimeOff;
    }

    getCurrentTime() {
        return this.widgetsBoardModel.getFirebaseTime();
    }

    private calcLabels () {
        const time = this.timerWidgetTimeService.calcDiffTime(
            this.state.stateTime.defaultTime, this.state.stateTime.time);
        const minutes = this.timerWidgetTimeService.getMinutes(time);
        const seconds = this.timerWidgetTimeService.getSeconds(time);
        this.state.labels = {
            minutes,
            seconds,
        };
    }

    private insertLabels (value) {
        const enteredValues = [];
        if (this.state.digitInserted < 4) {
            this.state.digitInserted++;
        }
        if (this.state.editingMode === TimerWidgetConfig.state.editModes.minutes) {
            enteredValues.push(this.state.labels.minutes % 10);
            enteredValues.push(value);
        } else {
            enteredValues.push(this.state.labels.minutes % 10);
            enteredValues.push((this.state.labels.seconds / 10) | 0);
            enteredValues.push(this.state.labels.seconds % 10);
            enteredValues.push(value);
            this.state.labels.seconds = (enteredValues[2] * 10) + enteredValues[3];
        }
        this.state.labels.minutes = (enteredValues[0] * 10) + enteredValues[1];
    }

    private setDigitToArray (label, array) {
        if (TimerWidgetConfig.digits.max === array.length) {
            return array;
        }
        array.push((label / 10) | 0);
        if (TimerWidgetConfig.digits.max === array.length) {
            return array;
        }
        array.push(label % 10);
        return array;
    }

    private removeLabels () {
        let enteredValues = [];
        enteredValues.push(0);

        if (this.state.editingMode === TimerWidgetConfig.state.editModes.minutes) {
            enteredValues.push((this.state.labels.minutes / 10) | 0);
            enteredValues = this.setDigitToArray(this.state.labels.seconds, enteredValues);
        } else {
            enteredValues = this.setDigitToArray(this.state.labels.minutes, enteredValues);
            enteredValues = this.setDigitToArray(this.state.labels.seconds, enteredValues);
        }
        this.state.labels.minutes = (enteredValues[0] * 10) + enteredValues[1];
        this.state.labels.seconds = (enteredValues[2] * 10) + enteredValues[3];
        if (this.state.editingMode === TimerWidgetConfig.state.editModes.minutes &&
            this.state.digitInserted <= 2) {
            return;
        }
        if (this.state.digitInserted > 0) {
            this.state.digitInserted--;
        }
    }

    private clearData () {
        if (this.state.digitInserted) {
            return;
        }
        this.state.labels.minutes = 0;
        this.state.labels.seconds = 0;
        this.resetTime();
    }

    pushIntoTimer(value) {
        this.clearData();
        if (value !== null) {
            this.insertLabels(value);
        } else {
            this.removeLabels();
        }
        this.state.stateTime.defaultTime =
            this.timerWidgetTimeService.calcDefaultTime(this.state.labels.minutes, this.state.labels.seconds);
        this.resetTime();
        this.changedSource.next();
        this.syncData();
    }

}
