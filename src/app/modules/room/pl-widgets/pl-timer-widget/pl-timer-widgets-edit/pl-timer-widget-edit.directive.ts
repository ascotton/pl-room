import { Directive, ElementRef, HostListener, Injectable } from '@angular/core';
import { TimerWidgetConfig } from '../pl-timer-widget-config.constant';
import { PLTimerWidgetIntervalService } from '../pl-timer-widget-interval.service';
import { PLTimerWidgetModelService } from '../pl-timer-widget-model.service';

@Directive({ selector: '[plTimerWidgetEdit]' })
@Injectable()
export class PLTimerWidgetEditDirective {

    constructor(private timerWidgetModel: PLTimerWidgetModelService,
                private timerWidgetInterval: PLTimerWidgetIntervalService) {
    }

     @HostListener('keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.keyPress(event);
    }

    keyPress(keyEvent: KeyboardEvent) {

        const keyPressConditions = TimerWidgetConfig.keypress;
        const editModesConfig = TimerWidgetConfig.state.editModes;
        const state = this.timerWidgetModel.getState();
        if (state.editingMode === TimerWidgetConfig.state.editModes.running) {
            return;
        }
        const keyCode = keyEvent.keyCode || 0;
        switch (true) {
                case (keyPressConditions.mode.indexOf(keyCode) !== -1):
                    let editingMode = this.timerWidgetModel.getState().editingMode;
                    const newEditingMode = editingMode === editModesConfig.seconds
                                        ? editModesConfig.minutes
                                        : editModesConfig.seconds;
                    this.timerWidgetModel.turnOnEditMode(newEditingMode);
                    break;
                case (keyPressConditions.minutes_mode.indexOf(keyCode) !== -1):
                    this.timerWidgetModel.turnOnEditMode(editModesConfig.minutes);
                    editingMode = this.timerWidgetModel.getState().editingMode;
                    break;
                case (keyPressConditions.seconds_mode.indexOf(keyCode) !== -1):
                    this.timerWidgetModel.turnOnEditMode(editModesConfig.seconds);
                    editingMode = this.timerWidgetModel.getState().editingMode;
                    break;
                case (keyPressConditions.backspace.indexOf(keyCode) !== -1):
                    this.timerWidgetModel.pushIntoTimer(null);
                    break;
                case (keyPressConditions.enter.indexOf(keyCode) !== -1):
                    if (this.timerWidgetModel.start(status)) {
                        this.timerWidgetInterval.start();
                    }
                    break;
                case (keyPressConditions.exit.indexOf(keyCode) !== -1):
                    const valueToPush = keyCode < 96 ? keyCode - 48 : keyCode - 96;
                    this.timerWidgetModel.pushIntoTimer(valueToPush);
                    break;
        }
    }
}
