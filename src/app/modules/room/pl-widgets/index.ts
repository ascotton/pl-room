import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ngx-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OverlayModule } from '@angular/cdk/overlay';


import {
    PLDotLoaderModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { PLCommonComponentsModule } from '@common/components';

import { PLWidgetsOverlayComponent } from './pl-widgets-overlay/pl-widgets-overlay.component';
import { PLWidgetsBoardComponent } from './pl-widgets-board/pl-widgets-board.component';

import { PLWidgetSettingsComponent } from './pl-widget-settings/pl-widget-settings.component';
import { PLDiceSettingsComponent } from './pl-widget-settings/dice-settings/pl-dice-settings.component';
import { PLDiceCustomizeComponent } from './pl-widget-settings/dice-settings/pl-dice-customize.component';
import { PLSpinnerSettingsComponent } from './pl-widget-settings/spinner-settings/spinner-settings.component';
import { PLFlashcardsSettingsModule } from './pl-widget-settings/flashcards-settings';
import { PLTimerSettingsComponent } from  './pl-widget-settings/timer-settings/timer-settings.component';

import { PLBaseWidgetComponent } from './pl-base-widget/pl-base-widget.component';
import { PLDiceWidgetComponent } from './pl-dice-widget/pl-dice-widget.component';
import { PLStopwatchWidgetComponent } from './pl-stopwatch-widget/pl-stopwatch-widget.component';
import { PLTimerWidgetComponent } from './pl-timer-widget/pl-timer-widget.component';
import
{
    PLTimerWidgetDigitsComponent,
}
from './pl-timer-widget/pl-timer-widget-digits/pl-timer-widget-digits.component';
import { PLTimerWidgetTimeService } from './pl-timer-widget/pl-timer-widget-time.service';
import { PLTimerWidgetModelService } from './pl-timer-widget/pl-timer-widget-model.service';
import { PLTimerWidgetIntervalService } from './pl-timer-widget/pl-timer-widget-interval.service';
import { PLTimerWidgetEditDirective } from './pl-timer-widget/pl-timer-widgets-edit/pl-timer-widget-edit.directive';
import { PLSpinnerWidgetComponent } from './pl-spinner-widget/pl-spinner-widget.component';
import { PixelRatioService } from './pl-spinner-widget/spinner/pixel-ratio.service';
import { FlashcardsWidgetModule } from './flashcards-widget';
import { PLPermissionsModule } from '@common/auth';

@NgModule({
    imports: [
        CommonModule,
        DndModule,
        DragDropModule,
        FlashcardsWidgetModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatGridListModule,
        MatMenuModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        PLCommonComponentsModule,
        PLInputModule,
        OverlayModule,
        PLFlashcardsSettingsModule,
        PLPermissionsModule,
    ],
    exports: [
        PLWidgetsOverlayComponent,
        PLWidgetsBoardComponent,
        PLBaseWidgetComponent,
        PLDiceWidgetComponent,
        PLStopwatchWidgetComponent,
        PLTimerWidgetComponent,
        PLTimerWidgetDigitsComponent,
        PLSpinnerWidgetComponent,
        PLWidgetSettingsComponent,
        PLDiceSettingsComponent,
        PLDiceCustomizeComponent,
        PLSpinnerSettingsComponent,
        PLTimerSettingsComponent,
    ],
    declarations: [
        PLWidgetsOverlayComponent,
        PLWidgetsBoardComponent,
        PLBaseWidgetComponent,
        PLDiceWidgetComponent,
        PLStopwatchWidgetComponent,
        PLTimerWidgetComponent,
        PLTimerWidgetDigitsComponent,
        PLSpinnerWidgetComponent,
        PLTimerWidgetEditDirective,
        PLWidgetSettingsComponent,
        PLDiceSettingsComponent,
        PLDiceCustomizeComponent,
        PLSpinnerSettingsComponent,
        PLTimerSettingsComponent,
    ],
    providers: [
        PLTimerWidgetTimeService,
        PLTimerWidgetModelService,
        PLTimerWidgetIntervalService,
        PixelRatioService,
    ],
})
export class PLWidgetsModule {}

export {
    PLWidgetsOverlayComponent,
};
