import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ngx-drag-drop';

import {
    PLDotLoaderModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PLCommonComponentsModule, PLExpansionPanelModule } from '@common/components';
import { PLDocumentationClientsModule } from './pl-documentation-drawer/documentation-clients';

import { PLRightDrawersComponent } from './pl-right-drawers/pl-right-drawers.component';
import { PLDocumentationDrawerComponent } from './pl-documentation-drawer/pl-documentation-drawer.component';
import { PLGamesDrawerModule } from './pl-games-drawer';
import { PLTeamWriteDrawerComponent } from './pl-team-write-drawer/pl-team-write-drawer.component';
import { PLRoomHelpDrawerComponent } from './pl-room-help-drawer/pl-room-help-drawer.component';
import { PLWidgetsDrawerComponent } from './pl-widgets-drawer/pl-widgets-drawer.component';
import { PLRightToolbarComponent } from './pl-right-toolbar/pl-right-toolbar.component';
import { StoreModule } from '@ngrx/store';

import { reducer } from './store';
import { PLPermissionsModule } from '@common/auth';
import { PLWidgetsService } from '../pl-widgets/pl-widgets.service';
import { PLSpinnerWidgetService } from '../pl-widgets/pl-spinner-widget/pl-spinner-widget.service';
import { PLDiceWidgetService } from '../pl-widgets/pl-dice-widget/pl-dice-widget.service';
import { PLStopwatchWidgetService } from '../pl-widgets/pl-stopwatch-widget/pl-stopwatch-widget.service';
import { PLTimerWidgetService } from '../pl-widgets/pl-timer-widget/pl-timer-widget.service';
import { PLDrawerPanelModule } from './pl-drawer-panel';
import { PLChatDrawerModule } from './pl-chat-drawer';
import { PLHomeworkDrawerModule } from './pl-homework-drawer';
import { PLFlashcardsWidgetService } from '../pl-widgets/pl-flashcards-widget/pl-flashcards-widget.service';
import { PLHelpDrawerModule } from './pl-help-drawer';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DndModule,
        PLIconModule,
        PLInputModule,
        PLCommonComponentsModule,
        PLExpansionPanelModule,
        PLDrawerPanelModule,
        PLDotLoaderModule,
        PLPermissionsModule,
        PLDocumentationClientsModule,
        PLGamesDrawerModule,
        StoreModule.forFeature('drawer', reducer),
        PLDocumentationClientsModule,
        PLChatDrawerModule,
        MatSliderModule,
        MatChipsModule,
        MatFormFieldModule,
        MatMenuModule,
        MatCheckboxModule,
        MatIconModule,
        PLHomeworkDrawerModule,
        PLHelpDrawerModule,
    ],
    exports: [
        PLRightDrawersComponent,
        MatSliderModule,
        MatChipsModule,
        MatFormFieldModule,
    ],
    declarations: [
        PLRightDrawersComponent,
        PLDocumentationDrawerComponent,
        PLTeamWriteDrawerComponent,
        PLRoomHelpDrawerComponent,
        PLWidgetsDrawerComponent,
        PLRightToolbarComponent,
    ],
    providers: [
        PLWidgetsService,
        PLSpinnerWidgetService,
        PLDiceWidgetService,
        PLStopwatchWidgetService,
        PLTimerWidgetService,
        PLFlashcardsWidgetService,
    ],
})
export class PLDrawersModule {}

export {
    PLRightDrawersComponent,
    PLDocumentationDrawerComponent,
    PLTeamWriteDrawerComponent,
    PLRoomHelpDrawerComponent,
};
