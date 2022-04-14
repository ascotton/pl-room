import { createAction, props } from '@ngrx/store';
import { BoardGame, GamePieceInstance, GamePieceType } from '../pl-board-games/pl-board-games-factory.service';
import { GameCategoryType } from './state';

export interface GameUpdatePayload {
    gameCategory: GameCategoryType;
    game: BoardGame;
}

export interface AddGamePiecePayload {
    piece: GamePieceInstance;
    location?: {
        x: number,
        y: number,
    };
}
export interface RemoveGamePiecePayload {
    piece: GamePieceInstance;
}

const open = createAction('/game/open');
const start = createAction('/game/start', props<GameUpdatePayload>());
const close = createAction('/game/close');
const addPiece = createAction('/game/addPiece', props<AddGamePiecePayload>());
const removePiece = createAction('/game/removePiece', props<RemoveGamePiecePayload>());

export const GameActions = {
    open,
    close,
    start,
    addPiece,
    removePiece,
};
