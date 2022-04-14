import { GamePieceInstance } from '../pl-board-games/pl-board-games-factory.service';

export enum GameCategoryType {
    BoardGame = 'board-game',
    OtherGame = 'other-game',
    None = 'no-game',
}

export interface GameState {
    open: boolean;
    gameCategory?: GameCategoryType;
    game?: any;
    pieces: GamePieceInstance[]
    action?: any;
}

export const initialState: GameState = {
    open: false,
    gameCategory: GameCategoryType.None,
    pieces: [],
};
