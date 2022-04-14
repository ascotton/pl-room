import { Component, Input, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import {
    PLLodashService,
} from '@root/index';

import { AngularCommunicatorService } from
    '@app/downgrade/angular-communicator.service';
import { AppState } from '@app/store';
import { Participant, selectActiveParticipants, selectLocalParticipantId, ParticipantType } from '@room/session/store';
import { concatMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'pl-go-fish',
    templateUrl: './pl-go-fish.component.html',
    styleUrls: ['./pl-go-fish.component.less'],
})
export class PLGoFishComponent implements OnInit, OnDestroy {
    @Input() activity: any = {};

    players: any[] = [];
    cards: any[] = [];
    currentPlayerId = '';
    playerDeckTypes = {
        hand: 1,
        discard: 0,
        won: 0,
    };
    startNewGame = 0;
    turnCount = 0;
    cardDisplay = 'imageAndText';
    dealCount = 5;
    mayViewAllPlayersIds = [];
    mayEndAllPlayersTurnsIds = [];
    mayMoveAllPlayersCardsIds = [];
    mayEndSelfTurn = 1;
    mayMoveCardsOffTurn = 0;
    theme: any = {};
    forceResize = 0;
    playerImageUrls = [];
    playerLayout = 'vertical';
    // playerLayout = 'circle';
    otherPlayerCardLayout = 'full';
    animateMoveCardsSeconds = 1;
    useScoreboard = 1;
    showWonOnScoreboard = 1;
    showWonCardsSeconds = 5;
    wonCardsScoreboard = {
        cards: [],
        player: {},
    };
    hideHandIfNewCards = 1;
    toggleWonDeckVisible = 1;
    showInstructions = 0;
    useSingleWonAllPlayers = 1;
    requirePreselectingPlayerForCardMove = 0;
    showHandText = 0;
    cardBackImageUrl = 'https://lightyearassets-cdn.presencelearning.com/f7eb9896-1f12-48a1-9477-89d7e17fe941.png';
    selectedCardsMax = 2;
    selectedCardsMaxOffTurn = 1;
    skipNewDeck = 1;
    flashSeconds = 1.5;
    drawCardsMax = 1;
    sortCardsMostRecentFirst = 1;

    fbActivity: any = {};
    possiblePlayers = [];

    private subscriptions: any = {};
    // TODO - figure out why on init, newGame gets fired from store..
    private allowNewGame = false;

    constructor(
        private angularCommunicator: AngularCommunicatorService,
        private store: Store<AppState>,
        private plLodash: PLLodashService,
        private zone: NgZone,
    ) {}

    ngOnInit() {
        this.getAvatars();
        this.initFirebase();

        this.subscriptions.personas = this.store.select(selectActiveParticipants).pipe(
            concatMap((participants) => {
                return of(participants).pipe(
                    withLatestFrom(this.store.select(selectLocalParticipantId)),
                );
            }),
        )
            .subscribe(([participants, localParticipantId]) => {
                this.getPlayers(participants, localParticipantId);
            });

        this.subscriptions.gameGoFish = this.store.select('gameGoFish')
            .subscribe((data: any) => {
                if (data.newGame) {
                    this.newGame(data.newGame);
                }
                if (data.turnCount !== undefined) {
                    this.turnCount = data.turnCount;
                    this.saveFirebaseVal('turnCount', this.turnCount);
                }
                if (data.cardDisplay !== undefined) {
                    this.cardDisplay = data.cardDisplay;
                    this.saveFirebaseVal('cardDisplay', this.cardDisplay);
                }
                if (data.theme !== undefined) {
                    this.theme = data.theme;
                    this.saveFirebaseVal('theme', this.theme);
                }
                if (data.dealCount !== undefined) {
                    this.dealCount = data.dealCount;
                    this.saveFirebaseVal('dealCount', this.dealCount);
                }
                if (data.mayEndSelfTurn !== undefined) {
                    this.mayEndSelfTurn = data.mayEndSelfTurn;
                    this.saveFirebaseVal('mayEndSelfTurn', this.mayEndSelfTurn);
                }
                // if (data.mayMoveCardsOffTurn !== undefined) {
                //     this.mayMoveCardsOffTurn = data.mayMoveCardsOffTurn;
                //     this.saveFirebaseVal('mayMoveCardsOffTurn', this.mayMoveCardsOffTurn);
                // }
                if (data.cards) {
                    this.fbActivity.child('cards').set(data.cards);
                    this.cards = data.cards;
                    this.newGame((this.startNewGame + 1));
                }
                if (data.forceResize) {
                    this.forceResize = data.forceResize;
                }
                if (data.viewAllPlayers !== undefined) {
                    const indexPlayer = this.mayViewAllPlayersIds.indexOf(this.currentPlayerId);
                    if (!data.viewAllPlayers) {
                        if (indexPlayer > -1) {
                            this.mayViewAllPlayersIds.splice(indexPlayer, 1);
                            // Force ngChange update to fire.
                            this.mayViewAllPlayersIds = [].concat(this.mayViewAllPlayersIds);
                        }
                    } else if (indexPlayer < 0) {
                        this.mayViewAllPlayersIds.push(this.currentPlayerId);
                        // Force ngChange update to fire.
                        this.mayViewAllPlayersIds = [].concat(this.mayViewAllPlayersIds);
                    }
                }
            });

        setTimeout(
            () => {
                this.allowNewGame = true;
            },
            2000,
        );
    }

    ngOnDestroy() {
        this.subscriptions.personas.unsubscribe();
        this.subscriptions.gameGoFish.unsubscribe();
    }

    getAvatars() {
        const rootDir = `https://cdn.presencelearning.com/emoji/`;
        const stampIds = ['1f436', '1f431', '1f430', '1f98a', '1f99d', '1f43c', '1f981', '1f438',
            '1f992', '1f98d', '1f417', '1f437', '1f43b', '1f47d', '1f916'];
        const imageUrls = [];
        stampIds.forEach((id) => {
            imageUrls.push(`${rootDir}${id}.svg`);
        });
        this.playerImageUrls = imageUrls;
    }

    newGame(newGameVal) {
        if (this.allowNewGame) {
            this.savePlayers(this.possiblePlayers);
            this.players = this.possiblePlayers;
            this.startNewGame = newGameVal;
        }
    }

    getPlayers(participants: Participant[], localId: string) {
        this.currentPlayerId = localId;

        const mayEndAllPlayersTurnsIds = [];
        const mayMoveAllPlayersCardsIds = [];
        this.possiblePlayers = participants.map(({ id, displayName, type }) => {
            const player = {
                id,
                name: displayName,
                buttonMayViewAllPlayers: 0,
                mayMoveAllPlayersCards: 0,
            };

            if (type === ParticipantType.host) {
                mayEndAllPlayersTurnsIds.push(id);
                mayMoveAllPlayersCardsIds.push(id);
                player.buttonMayViewAllPlayers = 1;
                player.mayMoveAllPlayersCards = 1;
            }

            return player;
        });

        this.mayEndAllPlayersTurnsIds = mayEndAllPlayersTurnsIds;
        this.mayMoveAllPlayersCardsIds = mayMoveAllPlayersCardsIds;
    }

    initFirebase() {
        const fbPath = `activities/queues/items/${this.activity.queueId}/items/${this.activity.activityId}`;
        this.fbActivity = this.angularCommunicator.getFirebaseRef(fbPath);
        this.fbActivity.child('players').on('value', (ref) => {
            this.zone.run(() => {
                const players = [];
                const playersObj = ref.val();
                if (playersObj) {
                    for (const playerId of Object.keys(playersObj)) {
                        players.push(playersObj[playerId]);
                    }
                }
                this.players = players;
            });
        });
        this.fbActivity.child('cards').on('value', (ref) => {
            this.zone.run(() => {
                const cards = ref.val();
                if (cards) {
                    this.cards = cards;
                    this.forceResize += 1;
                }
            });
        });
        this.fbActivity.child('cardDisplay').on('value', (ref) => {
            this.zone.run(() => {
                const cardDisplay = ref.val();
                if (cardDisplay) {
                    this.cardDisplay = cardDisplay;
                }
            });
        });
        this.fbActivity.child('dealCount').on('value', (ref) => {
            this.zone.run(() => {
                const dealCount = ref.val();
                if (dealCount) {
                    this.dealCount = dealCount;
                }
            });
        });
        this.fbActivity.child('mayEndSelfTurn').on('value', (ref) => {
            this.zone.run(() => {
                const mayEndSelfTurn = ref.val();
                if (mayEndSelfTurn !== undefined) {
                    this.mayEndSelfTurn = mayEndSelfTurn;
                }
            });
        });
        // this.fbActivity.child('mayMoveCardsOffTurn').on('value', (ref) => {
        //     const mayMoveCardsOffTurn = ref.val();
        //     if (mayMoveCardsOffTurn !== undefined) {
        //         this.mayMoveCardsOffTurn = mayMoveCardsOffTurn;
        //     }
        // });
        this.fbActivity.child('theme').on('value', (ref) => {
            this.zone.run(() => {
                const theme = ref.val();
                if (theme) {
                    this.theme = theme;
                }
            });
        });
        this.fbActivity.child('wonCardsScoreboard').on('value', (ref) => {
            this.zone.run(() => {
                const wonCardsScoreboard = ref.val();
                if (wonCardsScoreboard && wonCardsScoreboard.cards !== undefined) {
                    this.wonCardsScoreboard = wonCardsScoreboard;
                } else {
                    this.wonCardsScoreboard = {
                        cards: [],
                        player: {},
                    };
                }
            });
        });
        this.fbActivity.child('turnCount').on('value', (ref) => {
            this.zone.run(() => {
                const turnCount = ref.val();
                if (turnCount !== undefined) {
                    this.turnCount = turnCount;
                }
            });
        });
    }

    saveFirebaseVal(key, value) {
        this.fbActivity.child(key).set(value);
    }

    savePlayers(players) {
        const data = {};
        players.forEach((player) => {
            data[player.id] = this.plLodash.pick(player, ['id', 'name', 'currentTurn', 'imageUrl',
                'buttonMayViewAllPlayers', 'mayMoveAllPlayersCards', 'preselectedPlayerForCardMove',
                'playerCurrentTurnStartedAt']);
        });
        this.fbActivity.child('players').set(data);
    }

    onPlayerUpdated(evt) {
        const player = evt.player;
        const keys = evt.keys;
        const data = {};
        evt.keys.forEach((key) => {
            data[key] = player[key];
        });
        this.fbActivity.child('players').child(player.id).update(data);
    }

    onCardsUpdated(evt) {
        this.fbActivity.child('cards').set(evt.cards);
    }

    onTurnCountUpdated(evt) {
        this.fbActivity.child('turnCount').set(evt.turnCount);
    }

    onCardsScoreboardWonUpdated(evt) {
        this.fbActivity.child('wonCardsScoreboard').set(evt.wonCardsScoreboard);
    }
}
