import { Injectable } from '@angular/core';

export interface GamePieceType {
    imageSrc: string;
    name: string;
    gameBox: string;
    displayName?: string;
    height: number;
    width: number;
}

export interface GamePieceInstance {
    imageSrc: string;
    name: string;
    displayName?: string;
    width: number;
    height: number;
    x: number;
    y: number;
    key?: string;
    selected?: boolean;
    dragging?: boolean;
    fadeOut?: boolean;
    updated?: number;
    remoteChange?: boolean;
}

export interface GamePieceSetup {
    type: GamePieceType;
    count: number;
    usedCount?: number;
}

export interface GameBoard {
    name: string;
    displayName?: string;
    gameBox: string;
    imageSrc?: string;
    thumbSrc?: string;
}

export interface GameWidget {
    type: string;
    startX: number;
    startY: number;
    displayName?: string;
}

/**
 * GameRegion - a simple rectangular region
 */
export interface GameRegion {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * BoardGame interface

 */
export interface BoardGame {
    name: string;
    splashScreenSrc?: string;
    widgetOverrides?: any;
    board?: GameBoard;
    displayName?: string;
    pieceSetups?: GamePieceSetup[];
    /**
     * widgets - specificies any Widgets to be automatically added to the play area
     */
    widget?: GameWidget;
    widgetType?: string; // deperecated, originally just used type
    // widgets?: GameWidget[];
    thumbSrc?: string;
    iconSrc?: string;

    /** startRange - specifies the region of the board (as percentages) to initially place pieces in 
     *              if an automatic layout is applied
     * */
    startRegion?: GameRegion;
}

@Injectable()
export class PLBoardGamesFactoryService {

    readonly BOARD_GAMES_ASSET_DIR = `https://cdn.presencelearning.com/board-games/`;

    readonly gameBoards: GameBoard[] = [
        {
            name: 'playground-board',
            gameBox: 'playground',
            imageSrc: this.imageSrc('playground', 'playgroundBoard.svg'),
            thumbSrc: this.imageSrc('playground', 'playgroundThumb.svg'),
        },
        {
            name: 'checkers-board',
            gameBox: 'generic',
            imageSrc: this.imageSrc('generic', 'checkers-board.svg'),
        },
        {
            name: 'jungle-adventure-board',
            gameBox: 'jungle-adventure',
            imageSrc: this.imageSrc('jungle-adventure', 'jungle-adventure-board-4-30.svg'),
            // thumbSrc: this.imageSrc('jungle-adventure', 'jungle-adventure-board-thumb.svg'),
        },
        {
            name: 'space-adventure-board',
            gameBox: 'space-adventure',
            imageSrc: this.imageSrc('space-adventure', 'space-adventure-board-4-30.svg'),
            // thumbSrc: this.imageSrc('space-adventure', 'space-adventure-board-thumb.svg'),
        },
        {
            name: 'arctic-adventure-board',
            gameBox: 'arctic-adventure',
            imageSrc: this.imageSrc('arctic-adventure', 'arctic-adventure-board.svg'),
        }
    ];

    readonly gamePieceTypes: GamePieceType[] = [
        {
            name: 'simple-pawn',
            gameBox: 'generic',
            imageSrc: this.imageSrc('generic', 'simple-pawn.svg'),
            height: 4,
            width: 4,
        },
        {
            name: 'pawn-red',
            gameBox: 'generic',
            imageSrc: this.imageSrc('generic', 'pawn-red.svg'),
            height: 4,
            width: 4,
        },
        {
            name: 'pawn-black',
            gameBox: 'generic',
            imageSrc: this.imageSrc('generic', 'pawn-black.svg'),
            height: 4,
            width: 4,
        },

        this.buildGamePieceType('emoji', 'bat'),
        this.buildGamePieceType('emoji', 'elephant'),
        this.buildGamePieceType('emoji', 'bird'),
        this.buildGamePieceType('emoji', 'butterfly'),
        this.buildGamePieceType('emoji', 'frog-face'),
        this.buildGamePieceType('emoji', 'fox-face'),
        {
            name: 'trash',
            gameBox: 'emoji',
            imageSrc: this.imageSrc('emoji', 'wastebasket.svg'),
            height: 6,
            width: 6,
        },
    ];

    readonly boardGames: BoardGame[] = [
        {
            displayName: 'Jungle Adventure',
            name: 'jungle-adventure',
            widget: {
                type: 'spinner-widget',
                startX: 0.43,
                startY: 0.4,
            },
            board: this.getGameBoard('jungle-adventure-board'),
            iconSrc: this.imageSrc('jungle-adventure', 'jungle-game-icon.svg'),
            splashScreenSrc: this.imageSrc('jungle-adventure', 'jungle-splash-screen.svg'),
            pieceSetups: [
                {
                    type: this.buildGamePieceType('jungle-adventure', 'bird'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'chameleon'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'flamingo'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'lion'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'frog'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'monkey'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'sloth'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'tiger'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('jungle-adventure', 'rhino'),
                    count: 1,
                    usedCount: 0,
                }
            ],
            startRegion: {
                left: 8,
                top: 21,
                right: 18,
                bottom: 35,
            },
        },
        {
            displayName: 'Space Adventure',
            name: 'space-adventure',
            widget: {
                type: 'dice-widget',
                startX: 0.4,
                startY: 0.85,
            },
            board: this.getGameBoard('space-adventure-board'),
            iconSrc: this.imageSrc('space-adventure', 'space-game-icon.svg'),
            splashScreenSrc: this.imageSrc('space-adventure', 'space-splash-screen-5-3.svg'),
            pieceSetups: [
                {
                    type: this.buildGamePieceType('space-adventure', 'astronaut'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'green-alien'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'orange-alien'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'pink-alien'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'robot'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'satellite'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'spaceship'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'telescope'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('space-adventure', 'ufo'),
                    count: 1,
                    usedCount: 0,
                },
            ],
            startRegion: {
                left: 83,
                top: 67,
                right: 88,
                bottom: 83,
            },
        },
        {
            displayName: 'Arctic Adventure',
            name: 'arctic-adventure',
            widget: {
                type: 'dice-widget',
                startX: 0.5,
                startY: 0.21,
            },
            board: this.getGameBoard('arctic-adventure-board'),
            iconSrc: this.imageSrc('arctic-adventure', 'arctic-icon.svg'),
            splashScreenSrc: this.imageSrc('arctic-adventure', 'arctic-adventure-splash-screen.svg'),
            pieceSetups: [
                {
                    type: this.buildGamePieceType('arctic-adventure', 'deer'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'fox'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'owl'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'penguin'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'polar-bear'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'rabbit'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'tiger'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'walrus'),
                    count: 1,
                    usedCount: 0,
                },
                {
                    type: this.buildGamePieceType('arctic-adventure', 'wolf'),
                    count: 1,
                    usedCount: 0,
                },
            ],
            startRegion: {
                left: 7,
                top: 46,
                right: 14,
                bottom: 56,
            },
        },

    ];

    boardGameNames: string[] = [];
    boardGameOptions: {value: string, label: string}[] = [];
    constructor() {
        this.boardGameNames = this.boardGames.map(game => game.name);
        this.boardGames.forEach((game) => {
            this.boardGameOptions.push({ value: game.name, label: game.displayName });
            // preload background and preview images
            const boardImage: HTMLImageElement = new Image();
            boardImage.src = game.board.imageSrc;
        });
    }

    buildGamePieceType(gameBox, name) {
        return {
            name,
            gameBox,
            imageSrc: this.imageSrc(gameBox, name + '.svg'),
            height: 5,
            width: 5,
        };
    }

    getBoardGame(name) {
        return this.boardGames.find(game => game.name === name);
    }

    getGameBoard(name) {
        return this.gameBoards.find(board => board.name === name);
    }

    getGamePieceType(name) {
        return this.gamePieceTypes.find(piece => piece.name === name);
    }

    getDisplayName(name: string) {
        let tokens = name.split('-');
        tokens = tokens.map(token => token.charAt(0).toUpperCase() + token.slice(1));
        return tokens.join(' ');
    }

    getGamePieceInstance(gamePieceType: GamePieceType) : GamePieceInstance {
        if (!gamePieceType.height) {
            console.log('no height for gamePieceType: ', gamePieceType);
        }
        const instance: GamePieceInstance = {
            imageSrc: gamePieceType.imageSrc,
            name: gamePieceType.name,
            x: 0,
            y: 0,
            width: 1 * gamePieceType.width,
            height: 1 * gamePieceType.height,
            displayName:  gamePieceType.displayName ? 
                gamePieceType.displayName : this.getDisplayName(gamePieceType.name),
        };
        return instance;
    }

    imageSrc(boxName: string, imageName: string) {
        return `${this.BOARD_GAMES_ASSET_DIR}${boxName}/${imageName}`;
    }
}
