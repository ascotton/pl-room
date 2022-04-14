/**
 * @file DrawerRules.d.ts
 * This file describes the rules object for the Checkers game.
 */

export interface GametablePlayerAssignment {
    /** The unique browser id that the room can use to identify participants. */
    clientId: string;
}

// https://github.com/presencelearning/pl-gametable/blob/master/pl-checkers/dev/DrawerRules.d.ts
export interface GametableCheckersConfigInterface {
    /** Must be updated each time a set of rules are applied to create a new game. Should be set to Date.now(). null, undefined, or <= 0 indicates no game started. */
    gameId: number;	// SHOULD BE SET TO Date.now()

    /** Indicates which team goes first. Default should be true. */
    bottomMovesFirst: boolean;

    /** The board size. Default should be 8. */
    boardSize: 8 | 10 | 12;

    /** Indicates if jumps should be forced. Default should be false. */
    forceJumps: boolean;

    /** Indicates if moves should be shown when a checker is selected. Default should be true. */
    showMoves: boolean;

    /** The skin id to use. Default should be "Default". */
    skinId: "Default" | "Default Reversed" | "Classic" | "Classic Reversed" | "Wood" | "Wood Reversed" | "Cloth" | "Cloth Reversed";

    players: {
        top: GametablePlayerAssignment,
        bottom: GametablePlayerAssignment;
    };
}
// https://github.com/presencelearning/pl-gametable/blob/master/pl-dots-and-boxes/dev/DrawerRules.d.ts
export interface GametableDotsAndBoxesConfigInterface {
    /** Must be updated each time a set of rules are applied to create a new game. Should be set to Date.now(). null, undefined, or <= 0 indicates no game started. */
    gameId: number;	// SHOULD BE SET TO Date.now()

    numPlayers: 2 | 3 | 4;
    boardSize: "3x2" | "5x4" | "8x6" | "11x9";
    skinId: "Default" | "Classic" | "Dark" | "Sunset";

    /**
     * The following are player assignments for the numebr of users.
     * IMPORTANT:
     * 	- if numPlayers is 2, player1 and player2 must be assigned while player3 and player4 can be null
     * 	- if numPlayers is 3, player1, player2, and player3 must be assigned while player4 can be null
     * 	- if numPlayers is 4, player1, player2, player3, and player4 must be assigned
     */
    player1: GametablePlayerAssignment;
    player2: GametablePlayerAssignment;
    player3: GametablePlayerAssignment | null;
    player4: GametablePlayerAssignment | null;
}
// https://github.com/presencelearning/pl-gametable/blob/master/pl-blokd/dev/DrawerRules.d.ts
export interface GametableBlokdConfigInterface {
    /** Must be updated each time a set of rules are applied to create a new game. Should be set to Date.now(). null, undefined, or <= 0 indicates no game started. */
    gameId: number;	// SHOULD BE SET TO Date.now()

    numPlayers: 2 | 4;
    skinId: "Default" | "Classic" | "Vibrant" | "Animal";

    /**
     * The following are player assignments for the numebr of users.
     * IMPORTANT:
     *  - if numPlayers is 2, player1 and player2 must be assigned while player3 and player4 can be null
     *  - if numPlayers is 4, player1, player2, player3, and player4 must be assigned
     *  - When assigning players controls (via the drop down), a player can be assigned to an AI using the clientId "GAMETABLE-AI"
     *    Important: Do not set all 4 players to AIs. To enforce that all 4 players are not AIs, you should probably just remove the AI option from the Player1 assignment dropdown.
     */
    player1: GametablePlayerAssignment;
    player2: GametablePlayerAssignment;
    player3: GametablePlayerAssignment | null;
    player4: GametablePlayerAssignment | null;
}

// https://github.com/presencelearning/pl-gametable/blob/master/pl-trio/dev/DrawerRules.d.ts
export interface GametableTrioConfigInterface {
    /** Must be updated each time a set of rules are applied to create a new game. Should be sTrioet to Date.now(). null, undefined, or <= 0 indicates no game started. */
	gameId:number;	// SHOULD BE SET TO Date.now()

	numPlayers:1 | 2 | 3 | 4;
	skinId:"Default";

	/**
	 * The following are player assignments for the numebr of users.
	 * IMPORTANT:
	 * 	- if numPlayers is 1, player1 must be assigned while player2, player3, and player4 can be null
	 * 	- if numPlayers is 2, player1 and player2 must be assigned while player3 and player4 can be null
	 * 	- if numPlayers is 4, player1, player2, player3, and player4 must be assigned
	 */
	player1:GametablePlayerAssignment;
	player2:GametablePlayerAssignment | null;
	player3:GametablePlayerAssignment | null;
	player4:GametablePlayerAssignment | null;
}

export interface GameTableSettingsInterface {
    /** Indicates if all users game's should be muted. */
    mute: boolean; // true or false, any other value is interpreted as false
}
