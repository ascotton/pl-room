import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { PlBoardGamesComponent } from './pl-board-games/pl-board-games.component';
import { PlGamesComponent } from './pl-games.component';
import { PlBoardGamePieceComponent } from './pl-board-games/pl-board-game-piece/pl-board-game-piece.component';
import { PLBoardGamesFactoryService } from './pl-board-games/pl-board-games-factory.service';
import { reducer } from './store';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        StoreModule.forFeature('game', reducer),
    ],
    exports: [PlGamesComponent, PlBoardGamesComponent],
    declarations: [PlBoardGamesComponent, PlGamesComponent, PlBoardGamePieceComponent],
    providers: [PLBoardGamesFactoryService],
})
export class PLGamesModule { }

export {
    PlGamesComponent,
    PlBoardGamesComponent,
}
