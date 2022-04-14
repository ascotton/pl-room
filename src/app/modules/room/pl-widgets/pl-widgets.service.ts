import { Injectable } from '@angular/core';
import { PLDiceWidgetService } from './pl-dice-widget/pl-dice-widget.service';
import { PLFlashcardsWidgetService } from './pl-flashcards-widget/pl-flashcards-widget.service';
import { PLSpinnerWidgetService } from './pl-spinner-widget/pl-spinner-widget.service';
import { PLStopwatchWidgetService } from './pl-stopwatch-widget/pl-stopwatch-widget.service';
import { PLTimerWidgetService } from './pl-timer-widget/pl-timer-widget.service';

@Injectable()
export class PLWidgetsService {
    registedWidgetsList = [];

    constructor(
        spinnerWidgetService: PLSpinnerWidgetService,
        stopwatchWidgetService: PLStopwatchWidgetService,
        diceWidgetService: PLDiceWidgetService,
        timerWidgetService: PLTimerWidgetService,
        flashCardsWidgetService: PLFlashcardsWidgetService,
        ) {

        this.registerWidget(spinnerWidgetService.config);
        this.registerWidget(stopwatchWidgetService.config);
        this.registerWidget(diceWidgetService.config);
        this.registerWidget(timerWidgetService.config);
        this.registerWidget(flashCardsWidgetService.config);
    }

    registerWidget(widget) {
        return this.registedWidgetsList.push(widget);
    }

    getWidgets() {
        return this.registedWidgetsList;
    }
}
