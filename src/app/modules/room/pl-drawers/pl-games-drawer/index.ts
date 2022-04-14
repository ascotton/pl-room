import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    PLDotLoaderModule,
    PLIconModule,
    PLInputModule,
} from '@root/index';

import { PLCommonComponentsModule } from '@common/components';
import { PLExpansionPanelModule } from '@common/components/pl-expansion-panel';
import { PLDrawerPanelModule } from '../pl-drawer-panel';

import { PLGamesDrawerComponent } from './pl-games-drawer.component';
import { PLBoardGameControlsComponent } from './controls/pl-board-game-controls/pl-board-game-controls.component';
import { PLPieceSelectButtonComponent } from './controls/pl-piece-select-button/pl-piece-select-button.component';
import { PlBoardGameSelectButtonComponent } from './pl-board-game-select-button/pl-board-game-select-button.component';

import { StoreModule } from '@ngrx/store';

import { reducer } from '../store';
import { PLPermissionsModule } from '@common/auth';

@NgModule({
    imports: [
        CommonModule,
        PLIconModule,
        PLInputModule,
        PLCommonComponentsModule,
        PLExpansionPanelModule,
        PLDrawerPanelModule,
        PLDotLoaderModule,
        PLPermissionsModule,
        StoreModule.forFeature('drawer', reducer),
    ],
    exports: [
        PLGamesDrawerComponent,
    ],
    declarations: [
        PLGamesDrawerComponent,
        PLBoardGameControlsComponent,
        PLPieceSelectButtonComponent,
        PlBoardGameSelectButtonComponent,
    ],
    providers: [
    ],
})
export class PLGamesDrawerModule {}

export {
    PLGamesDrawerComponent,
    PLBoardGameControlsComponent,
    PLPieceSelectButtonComponent,
    PlBoardGameSelectButtonComponent,
};
