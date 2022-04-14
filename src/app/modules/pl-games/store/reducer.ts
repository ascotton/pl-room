import {  createReducer, on } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { GameState, initialState } from './state';
import { GameActions, GameUpdatePayload, AddGamePiecePayload, RemoveGamePiecePayload } from './actions';

function startAction(_state: GameState, action: GameUpdatePayload) {
    return {
        action,
        open: true,
        gameCategory: action.gameCategory,
        game: action.game,
        pieces: [],
    };
}

function addPieceAction(state: GameState, action: AddGamePiecePayload) {
    state.pieces.push(action.piece);
    return {
        ...state,
        action,
        newPiece: action.piece,
        location: action.location,
    };
}
function removePieceAction(state: GameState, action: RemoveGamePiecePayload) {
    const index = state.pieces.indexOf(action.piece);
    if (index > -1) {
        state.pieces.splice(index, 1);
    }
    return {
        ...state,
        action,
        removedPiece: action.piece,
    };
}

export const reducer = createReducer(
    initialState,
    on(GameActions.start, startAction),
    on(GameActions.addPiece, addPieceAction),
    on(GameActions.removePiece, removePieceAction),
);

export const updateGame = (state: AppState) => state.game;
