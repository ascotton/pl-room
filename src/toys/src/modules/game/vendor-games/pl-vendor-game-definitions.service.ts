import { PLGameConfig, PLGameDb, PLVendorGame, PLGameAdapterUrlParams } from './pl-vendor-game.service';

// =======================================================================
// Vendor Game Definitions
//
// Vendor games require two basic operations that depend on knowledge of
// game-specific criteria:
//   * start game with config options
//   * load iframe src with parameters
//
// Vendor game definitions implement an Adapter interface that allows
// the room to access custom game configuration in a generic way.
//
// Adding a new game requires the following development:
//   * add a game activity in django (and workspace migration)
//   * add a PLVendorGame for the new game
//   * implement PLVendorGame interface - events, getAdapter(), newFormData()
//   * update PLVendorGames and PLVendorGamesByActivity
//   * make a corresponding rail (drawer) component to control the game
//   * add events to signal between the rail and the game components
// =======================================================================

// Gametable (Spencer) / Checkers
const checkers: PLVendorGame = {
    vendor: 'gametable',
    name: 'checkers',
    setConfig: (plGameDb: PLGameDb, config: PLGameConfig) => {
        const rules = plGameDb.ref('rules');
        rules.set(
            config,
            () => console.log(`${checkers.name} game set config OK`, config),
            (reason) => console.log(`${checkers.name} game set config ERR`, reason)
        );
    },
    getIframeUrl: (params: PLGameAdapterUrlParams) => {
        const { isRoomOwner, clientId } = params;
        return `/assets/static-files/vendor-games/gametable/versions/v1/checkers/game.html?isRoomOwner=${isRoomOwner}&clientId=${clientId}`;
    },
    newFormData: () => {
        return {
            boardSizeOpts: [
                { label: '8x8', value: 8 },
                { label: '10x10', value: 10 },
                { label: '12x12', value: 12 },
            ],
            boardThemeOpts: [
                { label: 'Default', value: 'Default' },
                { label: 'Classic', value: 'Classic' },
                { label: 'Wood', value: 'Wood' },
                { label: 'Cloth', value: 'Cloth' },
            ],
            playerOpts: [],
            model: {
                boardSize: 8,
                boardTheme: 'Default',
                showMoves: true,
                bottomMovesFirst: true,
                playerTop: null,
                playerBottom: null,
            },
        }
    }
}

// Gametable (Spencer) / Dots and Boxes
const dotsAndBoxes: PLVendorGame = {
    vendor: 'gametable',
    name: 'dotsAndBoxes',
    setConfig: (plGameDb: PLGameDb, config: PLGameConfig) => {
        const rules = plGameDb.ref('rules');
        rules.set(
            config,
            () => console.log(`${checkers.name} game set config OK`, config),
            (reason) => console.log(`${checkers.name} game set config ERR`, reason)
        );
    },
    getIframeUrl: (params: PLGameAdapterUrlParams) => {
        const { isRoomOwner, clientId } = params;
        return `/assets/static-files/vendor-games/gametable/versions/v1/dotsAndBoxes/game.html?isRoomOwner=${isRoomOwner}&clientId=${clientId}`;
    },
    newFormData: () => {
        return {
            boardSizeOpts: [
                { label: '3x2', value: '3x2' },
                { label: '5x4', value: '5x4' },
                { label: '8x6', value: '8x6' },
                { label: '11x9', value: '11x9' },
            ],
            boardThemeOpts: [
                { label: 'Default', value: 'Default' },
                { label: 'Classic', value: 'Classic' },
                { label: 'Dark', value: 'Dark' },
                { label: 'Sunset', value: 'Sunset' },
            ],
            numPlayersOpts: [
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
            ],
            playerOpts: [],
            model: {
                boardSize: '3x2',
                boardTheme: 'Default',
                numPlayers: 2,
                player1: null,
                player2: null,
                player3: null,
                player4: null,
            }
        };
    }
}

// Gametable (Spencer) / Blokd
const blokd: PLVendorGame = {
    vendor: 'gametable',
    name: 'blokd',
    setConfig: (plGameDb: PLGameDb, config: PLGameConfig) => {
        const rules = plGameDb.ref('rules');
        rules.set(
            config,
            () => console.log(`${blokd.name} game set config OK`, config),
            (reason) => console.log(`${blokd.name} game set config ERR`, reason)
        );
    },
    getIframeUrl: (params: PLGameAdapterUrlParams) => {
        const { isRoomOwner, clientId } = params;
        return `/assets/static-files/vendor-games/gametable/versions/v1/blokd/game.html?isRoomOwner=${isRoomOwner}&clientId=${clientId}`;
    },
    newFormData: () => {
        return {
            boardThemeOpts: [
                { label: 'Default', value: 'Default' },
                { label: 'Classic', value: 'Classic' },
                { label: 'Vibrant', value: 'Vibrant' },
                { label: 'Animal', value: 'Animal' },
            ],
            numPlayersOpts: [
                { label: '2', value: 2 },
                { label: '4', value: 4 },
            ],
            playerOpts: [],
            model: {
                boardTheme: 'Default',
                numPlayers: 2,
                player1: null,
                player2: null,
                player3: null,
                player4: null,
            }
        };
    }
}

// Gametable (Spencer) / Trio
const trio: PLVendorGame = {
    vendor: 'gametable',
    name: 'trio',
    setConfig: (plGameDb: PLGameDb, config: PLGameConfig) => {
        const rules = plGameDb.ref('rules');
        rules.set(
            config,
            () => console.log(`${trio.name} game set config OK`, config),
            (reason) => console.log(`${trio.name} game set config ERR`, reason)
        );
    },
    getIframeUrl: (params: PLGameAdapterUrlParams) => {
        const { isRoomOwner, clientId } = params;
        return `/assets/static-files/vendor-games/gametable/versions/v1/trio/game.html?isRoomOwner=${isRoomOwner}&clientId=${clientId}`;
    },
    newFormData: () => {
        return {
            boardSizeOpts: [],
            boardThemeOpts: [{ label: 'Default', value: 'Default' }],
            numPlayersOpts: [
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
            ],
            playerOpts: [],
            model: {
                boardSize: 8,
                boardTheme: 'Default',
                showMoves: true,
                bottomMovesFirst: true,
                playerTop: null,
                playerBottom: null,
                players: [
                    {
                        position: 1,
                        value: ""
                    },
                    {
                        position: 2,
                        value: ""
                    },
                    {
                        position: 3,
                        value: ""
                    },
                    {
                        position: 4,
                        value: ""
                    },
                ]
            },
        }
    }
}

// =======================================================================
// List of vendor games available to the room
// =======================================================================
export const PLVendorGames = {
    checkers,
    dotsAndBoxes,
    blokd,
    trio
};

// =======================================================================
// List of game activity django item keys
// =======================================================================
export const PLVendorGamesByActivity = {
    'game-gametable-checkers': PLVendorGames.checkers,
    'game-gametable-dots-and-boxes': PLVendorGames.dotsAndBoxes,
    'game-gametable-blokd': PLVendorGames.blokd,
    'game-gametable-trio': PLVendorGames.trio,
};
