import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';

import {
    PLLodashService,
} from '@root/index';

@Component({
    selector: 'pl-card-game',
    templateUrl: './pl-card-game.component.html',
    styleUrls: ['./pl-card-game.component.less'],
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class PLCardGameComponent {
    /**
    E.g.
    players = [
        {
            id: 'player1',
            name: 'John',
        },
        {
            id: 'player2',
            name: 'Sally',
        },
    ];
    */
    @Input() players: any[] = [];

    /**
    E.g.
    cards = [
        {
            id: 'card1',
            imageUrl: 'http://myhost.com/image1.jpg',
            text: 'Card 1',
            playerId: '_dealer',
            deck: 'hand',
        },
        {
            id: 'card2',
            imageUrl: 'http://myhost.com/image2.jpg',
            text: 'Card 2',
            playerId: 'player1',
            deck: 'won',
        },
    ];
    */
    @Input() cards: any[] = [];

    @Input() currentPlayerId: '';
    @Input() startNewGame = 0;
    @Input() cardDisplay = 'imageAndText';
    @Input() mayViewAllPlayersIds = [];
    @Input() mayEndAllPlayersTurnsIds = [];
    @Input() mayMoveAllPlayersCardsIds = [];
    @Input() mayEndSelfTurn = true;
    @Input() mayMoveCardsOffTurn = 1;
    @Input() turnCount = 0;

    @Input() dealCount: number = 5;
    @Input() containerClass = 'workspace';
    @Input() backgroundImageUrl = '';
    @Input() backgroundStyles: any = {};
    @Input() contentStyles: any = {};
    @Input() dealerStyles: any = {};
    @Input() playersStyles: any = {};
    @Input() cardBackImageUrl = 'https://lightyearassets-cdn.presencelearning.com/3f0a3cc9-48f6-4efe-bbc9-056de1ad7d01.png';
    @Input() useDiscard = 0;
    @Input() playerDeckTypes = {
        hand: 1,
        discard: 0,
        won: 0,
    };
    @Input() dealerDeckTypes = {
        hand: 1,
        discard: 0,
    };
    @Input() transferToPlayerAllowed = 'anytime';
    @Input() mayGiveCardsToActivePlayerOnly = 1;
    @Input() margin = 5;
    @Input() forceResize = 0;
    @Input() playerImageUrls = [];

    // One of: 'circle', 'vertical'
    @Input() playerLayout = 'circle';
    // One of: 'compact', 'full'
    @Input() otherPlayerCardLayout = 'compact';
    @Input() animateMoveCardsSeconds = 0;
    @Input() useScoreboard = 0;
    @Input() showWonOnScoreboard = 0;
    @Input() showWonCardsSeconds = 3;
    @Input() wonCardsScoreboard: any = {
        player: {},
        cards: []
    };
    @Input() hideHandIfNewCards = 0;
    @Input() toggleWonDeckVisible = 0;
    @Input() showInstructions = 1;
    @Input() useSingleWonAllPlayers = 0;
    @Input() requirePreselectingPlayerForCardMove = 0;
    @Input() showHandText = 1;
    @Input() selectedCardsMax = -1;
    @Input() selectedCardsMaxOffTurn = -1;
    @Input() skipNewDeck = 0;
    @Input() flashSeconds = -1;
    @Input() drawCardsMax = -1;
    @Input() sortCardsMostRecentFirst = 0;

    @Output() onPlayerUpdated = new EventEmitter<any>();
    @Output() onCardsUpdated = new EventEmitter<any>();
    @Output() onTurnCountUpdated = new EventEmitter<any>();
    @Output() onCardsScoreboardWonUpdated = new EventEmitter<any>();

    // Random starting values; will be reset dynamically.
    width: number = 500;
    height: number = 500;
    eleContainer: any;
    timeouts: any = {
        resize: null,
        wonCardsScoreboard: null,
        drawCardsCountPerTurnReset: null,
        animatedMove: null,
    };
    styles: any = {
        background: {},
        content: {},
        dealer: {},
        players: {},
    };
    classes: any = {
        singleWonMatch: {
            flashIt: false,
        },
        singleWonScores: {
            flashIt: false,
        }
    };

    playersLocal: any[] = [];
    currentTurnPlayerId = '';
    selectedCardIds: any[] = [];
    mayViewAllPlayerCards: boolean = false;
    mayEndAllPlayersTurns: boolean = false;
    mayMoveAllPlayersCards: boolean = false;

    cardsAnimated: any[] = [];

    checkShowArrows = 0;
    singleWonAllPlayersClass = 'won-cards-scoreboard-cards';
    showWonCardsScoreboard = false;

    drawCardsCountPerTurn = 0;
    turnCountLastValue = -1;

    instanceId = '';
    dealerPlayerId = '_dealer';

    constructor(
        private plLodash: PLLodashService,
        private zone: NgZone,
    ) {
    }

    ngOnInit() {
        this.setBackgroundStyles();
        this.setContentStyles();
        if (!this.instanceId) {
            this.instanceId = this.plLodash.randomString();
        }
    }

    ngOnChanges(changes: any) {
        if (!this.instanceId) {
            this.instanceId = this.plLodash.randomString();
        }
        if (changes.players) {
            this.positionPlayers();
        }
        if (changes.currentPlayerId) {
            this.setPlayers();
            // this.newGame();
        }
        if (changes.startNewGame && changes.startNewGame.previousValue !== undefined && this.startNewGame) {
            this.positionPlayers(1);
            this.newGame();
        }
        if (changes.turnCount) {
            this.resetTurnCount();
        }
        if (changes.mayViewAllPlayersIds) {
            this.setMayViewPlayers();
        }
        if (changes.mayEndAllPlayersTurnsIds) {
            this.setMayEndAllPlayersTurns();
        }
        if (changes.mayMoveAllPlayersCardsIds) {
            this.setMayMoveAllPlayersCards();
        }
        if (changes.backgroundImageUrl || changes.backgroundStyles) {
            this.setBackgroundStyles();
        }
        if (changes.contentStyles || changes.dealerStyles || changes.playersStyles) {
            this.setContentStyles();
        }
        if (changes.forceResize) {
            this.onResize({});
        }
        if (changes.wonCardsScoreboard) {
            if (this.wonCardsScoreboard.cards && this.wonCardsScoreboard.cards.length > 0) {
                this.showWonCardsScoreboard = true;
            } else {
                this.showWonCardsScoreboard = false;
                this.flashScoreboard();
            }
        }
        // Classes are not synced (they are local only) so any card
        // changes will reset classes. Update any variables to match (e.g.
        // any selected cards will no longer be selected).
        if (changes.cards) {
            this.selectedCardIds = [];
        }
    }

    onResize(evt) {
        if (this.timeouts.resize) {
            clearTimeout(this.timeouts.resize);
        }
        this.timeouts.resize = setTimeout(() => {
            this.zone.run(() => {
                this.positionPlayers();
                this.checkShowArrows += 1;
            });
        }, 500);
    }

    setBackgroundStyles() {
        const styles: any = {};
        if (this.backgroundImageUrl) {
            styles.backgroundImage = `url(${this.backgroundImageUrl})`
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundPosition = 'center';
            styles.backgroundSize = 'cover';
        }
        if (this.backgroundStyles && this.backgroundStyles.opacity !== undefined) {
            styles.opacity = this.backgroundStyles.opacity;
        }
        this.styles.background = styles;
    }

    setContentStyles() {
        let styles: any = {};
        if (this.contentStyles && this.contentStyles.color) {
            styles.color = this.contentStyles.color;
        }
        this.styles.content = styles;

        styles = {};
        if (this.dealerStyles && this.dealerStyles.color) {
            styles.color = this.dealerStyles.color;
        }
        this.styles.dealer = styles;

        styles = {};
        if (this.playersStyles && this.playersStyles.color) {
            styles.color = this.playersStyles.color;
        }
        this.styles.players = styles;
    }

    setMayViewPlayers() {
        this.mayViewAllPlayerCards = false;
        this.playersLocal.some((player) => {
            if (player.id === this.currentPlayerId) {
                if (this.mayViewAllPlayersIds.includes(player.id)) {
                    this.mayViewAllPlayerCards = true;
                }
                return true;
            }
            return false;
        });
        this.updatePlayerClasses();
    }

    setMayEndAllPlayersTurns() {
        this.mayEndAllPlayersTurns = false;
        if (this.mayEndAllPlayersTurnsIds && this.mayEndAllPlayersTurnsIds.length) {
            this.playersLocal.forEach((player) => {
                if (player.id === this.currentPlayerId) {
                    if (this.mayEndAllPlayersTurnsIds.includes(player.id)) {
                        this.mayEndAllPlayersTurns = true;
                    }
                }
            });
        }
    }

    setMayMoveAllPlayersCards() {
        this.mayMoveAllPlayersCards = false;
        if (this.mayMoveAllPlayersCardsIds && this.mayMoveAllPlayersCardsIds.length) {
            this.playersLocal.forEach((player) => {
                if (player.id === this.currentPlayerId) {
                    if (this.mayMoveAllPlayersCardsIds.includes(player.id)) {
                        this.mayMoveAllPlayersCards = true;
                    }
                }
            });
        }
    }

    randomInt(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    resetTurnCount() {
        if (this.turnCount !== this.turnCountLastValue) {
            this.drawCardsCountPerTurn = 0;
            this.unselectAllCards();
        }
        this.turnCountLastValue = this.turnCount;
    }

    setPlayers(updateImage=0) {
        // Only want to update the player image at start; after that want to persist it.
        // So set on players object directly.
        const playerImagesLength = this.playerImageUrls.length;
        if (updateImage && playerImagesLength) {
            this.players.forEach((player) => {
                player.selectingPlayerImage = false;
                player.imageUrl = this.playerImageUrls[this.randomInt(0, (playerImagesLength-1))];
                // Only applicable if toggleWonDeckVisible.
                player.wonDeckVisible = false;
                this.updatePlayer(player, ['imageUrl']);
            });
        }

        const nowEpoch = Date.now();
        let flashPlayerId = '';

        // Should probably be able to just check past turn and compare to current (new)
        // one, but we seem to get 2 updates that fire - one to remove the previous turn
        // (and current one is blank) and the 2nd that has the new turn.
        // So, we will use timestamps to compare changes.
        // let previousTurnPlayerId = '';
        // if (this.playersLocal.length) {
        //     this.playersLocal.forEach((player) => {
        //         if (player.currentTurn) {
        //             previousTurnPlayerId = player.id;
        //         }
        //     });
        // }

        this.playersLocal = this.players.map((player) => {
            let playerTemp = Object.assign(player, {
                xStyles: {},
                xClasses: this.setDefaultPlayerClasses(player),
            });
            if (player.currentTurn && player.currentTurnStartedAt &&
                nowEpoch - player.currentTurnStartedAt < 1000 * 15) {
                if (this.flashSeconds > 0) {
                    flashPlayerId = player.id;
                }
            }
            if (player.currentTurn) {
                this.currentTurnPlayerId = player.id;
                playerTemp.xClasses.currentTurn = true;
            }
            if (player.id === this.currentPlayerId) {
                playerTemp.xClasses.selfPlayer = true;
                if (player.mayMoveAllPlayersCards) {
                    this.mayMoveAllPlayersCards = true;
                }
            }
            if (player.id !== this.currentPlayerId && this.otherPlayerCardLayout === 'compact') {
                playerTemp.xClasses.compactPlayer = true;
            }
            if (player.preselectedPlayerForCardMove) {
                playerTemp.xClasses.preselected = true;
            }
            return playerTemp;
        });

        if (flashPlayerId) {
            this.flashPlayer(flashPlayerId);
        }

        this.setMayViewPlayers();
        this.setMayEndAllPlayersTurns();
        this.setMayMoveAllPlayersCards();
    }

    updatePlayerClasses() {
        this.playersLocal.forEach((player) => {
            if (player.id === this.currentPlayerId || this.mayViewAllPlayerCards || this.otherPlayerCardLayout === 'full') {
                player.xClasses.displayNoCards = false;
            } else {
                player.xClasses.displayNoCards = true;
            }
        });
    }

    positionPlayers(updateImage=0) {
        this.setPlayers(updateImage);
        this.getDimensions();
        this.getPlayerPositions(this.width, this.height, this.margin);
    }

    getDimensions() {
        this.eleContainer = document.querySelector(`.${this.containerClass}`);
        const eleDealer: any = document.querySelector('.dealer');
        this.width = this.eleContainer.offsetWidth;
        this.height = this.eleContainer.offsetHeight - eleDealer.offsetHeight;
    }

    getPlayerPositions(width, height, margin) {
        if (this.playerLayout === 'vertical') {
            this.getPlayerPositionsVertical(width, height, margin);
        } else {
            this.getPlayerPositionsCircle(width, height, margin);
        }
    }

    getPlayerPositionsVertical(width, height, margin) {
        const playerCount = this.playersLocal.length;
        const heightPerPlayer = height / playerCount;
        const playerWidth = width - margin * 2;
        this.playersLocal.forEach((player, index) => {
            let top = index * heightPerPlayer;
            player.coords = {
                left: margin,
                top: top + margin / 2,
                width: playerWidth,
                height: heightPerPlayer - margin,
            };
            player.xStyles = {
                left: `${player.coords.left}px`,
                top: `${player.coords.top}px`,
                width: `${player.coords.width}px`,
                height: `${player.coords.height}px`,
            };
        });
    }

    // Put players in a circle evenly spread out.
    getPlayerPositionsCircle(width, height, margin) {
        const playerCount = this.playersLocal.length;
        const degreesPerPlayer = Math.floor(360 / playerCount);
        // const areaPerPlayer = width * height / playerCount;
        // const widthHeightRatio = width / height;
        const maxPlayerDimensions = {
            // width: Math.floor(Math.sqrt(areaPerPlayer) * widthHeightRatio),
            // height: Math.floor(Math.sqrt(areaPerPlayer) / widthHeightRatio),
            width: Math.floor(width / playerCount) - margin * 2,
            height: Math.floor(height / playerCount) - margin * 2,
        };
        this.playersLocal.forEach((player, index) => {
            let degrees = degreesPerPlayer * index;
            let coords: any = this.degreesToXY(degrees, width, height);
            let leftTop = this.getLeftTop(coords.x, coords.y, maxPlayerDimensions.width,
                maxPlayerDimensions.height, width, height, margin);
            coords.left = leftTop.left;
            coords.top = leftTop.top;
            player.coords = {
                left: coords.left,
                top: coords.top,
                width: maxPlayerDimensions.width,
                height: maxPlayerDimensions.height,
            }
            player.xStyles = {
                left: `${player.coords.left}px`,
                top: `${player.coords.top}px`,
                width: `${player.coords.width}px`,
                height: `${player.coords.height}px`,
            };
        });
    }

    getLeftTop(x, y, width, height, maxWidth, maxHeight, margin) {
        let left = x - width / 2;
        if (left < 0 + margin) {
            left = 0 + margin;
        }
        if ((left + width) > maxWidth - margin) {
            left = maxWidth - width - margin;
        }
        let top = y - height / 2;
        if (top < 0 + margin) {
            top = 0 + margin;
        }
        if ((top + height) > maxHeight - margin) {
            top = maxHeight - height - margin;
        }
        return {
            left,
            top,
        };
    }

    /**
    x = xCenter + radius * cos (degrees * pi / 180)
    y = yCenter - ellipseFactor * radius * sin (degrees * pi / 180)
    */
    degreesToXY(degrees, width, height) {
        const ellipseFactor = height / width;
        const xCenter = width / 2;
        const yCenter = height / 2;
        const radius = width / 2;
        return {
            x: Math.floor(xCenter + radius * Math.cos(degrees * Math.PI / 180)),
            y: Math.floor(yCenter - ellipseFactor * radius * Math.sin(degrees * Math.PI / 180)),
        };
    }

    choosePlayerImage(player) {
        if (player.id === this.currentPlayerId) {
            player.selectingPlayerImage = true;
        }
    }

    setPlayerImage(player, imageUrl) {
        player.imageUrl = imageUrl;
        player.selectingPlayerImage = false;
        this.updatePlayer(player, ['imageUrl']);
    }

    newGame() {
        // Reset.
        this.selectedCardIds = [];
        this.hideWonCardsScoreboard();
        this.turnCountLastValue = -1;
        this.turnCount = 0;
        this.drawCardsCountPerTurn = 0;
        this.unselectAllCards();
        this.cardsAnimated = [];
        if (this.timeouts.animatedMove) {
            clearTimeout(this.timeouts.animatedMove);
        }
        this.cards.forEach((card) => {
            card.playerId = this.dealerPlayerId;
            card.deck = 'hand';
            card.xUpdatedAt = Date.now();
            // Needed for animations; card.id may not be unique if multiple copies
            // of the same card.
            card.uniqueId = this.plLodash.randomString();
        });
        if (this.playersLocal.length) {
            this.playersLocal.forEach((player, indexPlayer) => {
                this.playersLocal[indexPlayer].xClasses = this.setDefaultPlayerClasses(player);
            });
            this.nextTurn();
            this.shuffleCards();
            this.dealCards(this.dealCount);
        }
    }

    filterCards(cards, playerId, deck, sort=false) {
        if (!cards || !cards.length) {
            return [];
        }
        if (sort && cards[0].sort !== undefined) {
            return this.plLodash.sort2d(cards.filter((card) => {
                return (card.playerId === playerId && (card.deck === deck || !deck));
            }), 'sort');
        }
        if (sort && this.sortCardsMostRecentFirst) {
            return this.plLodash.sort2d(cards.filter((card) => {
                return (card.playerId === playerId && (card.deck === deck || !deck));
            }), 'xUpdatedAt', 'descending');
        }
        return cards.filter((card) => {
            return (card.playerId === playerId && (card.deck === deck || !deck));
        });
    }

    getPlayerById(playerId) {
        return this.playersLocal.filter((player) => {
            return player.id === playerId;
        })[0];
    }

    nextTurnGetPlayer() {
        let playerIndex = -1;
        this.playersLocal.forEach((player, index) => {
            if (player.id === this.currentTurnPlayerId) {
                playerIndex = index;
            }
        });
        this.nextTurn(playerIndex);
    }

    nextTurn(playerIndex=-1) {
        let nextPlayerIndex = 0;
        if (playerIndex > -1) {
            nextPlayerIndex = (playerIndex === this.playersLocal.length - 1) ? 0 : playerIndex + 1;
            this.playersLocal[playerIndex].xClasses.currentTurn = false;
            this.playersLocal[playerIndex].currentTurn = false;
            this.playersLocal[playerIndex].currentTurnStartedAt = '';
            this.updatePlayer(this.playersLocal[playerIndex],
                ['currentTurn', 'currentTurnStartedAt']);
        }
        this.currentTurnPlayerId = this.playersLocal[nextPlayerIndex].id;
        this.playersLocal[nextPlayerIndex].xClasses.currentTurn = true;
        this.playersLocal[nextPlayerIndex].currentTurn = true;
        this.playersLocal[nextPlayerIndex].currentTurnStartedAt = Date.now();
        this.updatePlayer(this.playersLocal[nextPlayerIndex],
            ['currentTurn', 'currentTurnStartedAt']);

        if (this.requirePreselectingPlayerForCardMove) {
            this.unselectPreselectedPlayer();
        }
        this.turnCount += 1;
        this.updateTurnCount();
    }

    shuffleCards() {
        // Assign random number to each card, then sort them by the number.
        this.cards.forEach((card) => {
            card.shuffleNumber = Math.random();
        });
        this.cards = this.plLodash.sort2d(this.cards, 'shuffleNumber');
        this.updateCards();
    }

    dealCards(rounds) {
        for (let round = 0; round < rounds; round++) {
            this.playersLocal.forEach((player, indexPlayer) => {
                this.drawCards(player.id, 1, 'hand');
            });
        }
        this.updateCards();
    }

    drawCardsPlayerId(playerId, count=1) {
        let mayDraw = 1;
        if (this.drawCardsMax >= 0 && this.drawCardsCountPerTurn >= this.drawCardsMax) {
            mayDraw = 0;
        }
        if (this.currentTurnPlayerId === playerId && mayDraw) {
            // const player = this.getPlayerById(playerId);
            this.drawCards(playerId);
            this.drawCardsCountPerTurn += 1;
        }
    }

    drawCards(playerId, skipUpdate=0, deck='new') {
        if (deck === 'new' && this.skipNewDeck) {
            deck = 'hand';
        }
        const cardsDealerHand = this.filterCards(this.cards, this.dealerPlayerId, 'hand');
        if (cardsDealerHand.length < 1) {
            console.warn('Ran out of cards to deal.');
        } else {
            cardsDealerHand[0].xClasses = this.setDefaultCardClasses(cardsDealerHand[0]);
            this.moveCard(cardsDealerHand[0], playerId, deck, '', '', 1);
            cardsDealerHand[0].playerId = playerId;
            cardsDealerHand[0].deck = deck;
            cardsDealerHand[0].xUpdatedAt = Date.now();
            if (!skipUpdate) {
                this.updateCards();
            }
            if (deck === 'new') {
                this.autoTransferNewToHand([cardsDealerHand[0].id], playerId);
            }
        }
    }

    autoTransferNewToHand(cardIds, playerId, delay=5000) {
        setTimeout(() => {
            let atLeastOneUpdated = 0;
            const cardsPlayer = this.filterCards(this.cards, playerId, 'new');
            cardsPlayer.forEach((card) => {
                if (cardIds.includes(card.id)) {
                    card.deck = 'hand';
                    atLeastOneUpdated = 1;
                }
            });
            if (atLeastOneUpdated) {
                this.updateCards();
            }
        }, delay);
    }

    transferCardsCurrentPlayer(playerToId) {
        let mayTransfer = 0;
        if (playerToId === this.currentTurnPlayerId || !this.mayGiveCardsToActivePlayerOnly) {
            mayTransfer = 1;
        }
        if (this.currentTurnPlayerId === this.currentPlayerId &&
            (!this.mayGiveCardsToActivePlayerOnly || playerToId === this.currentTurnPlayerId)) {
            mayTransfer = 1;
        }
        if (this.transferToPlayerAllowed === 'anytime' && this.mayMoveCardsOffTurn) {
            mayTransfer = 1;
        }
        if (this.mayMoveAllPlayersCards) {
            mayTransfer = 1;
        }
        if (this.requirePreselectingPlayerForCardMove && this.currentPlayerId !== this.getPreselectedPlayerId()) {
            mayTransfer = 0;
        }
        if (this.selectedCardIds.length && playerToId !== this.currentPlayerId && mayTransfer) {
            this.transferCards(this.selectedCardIds, this.currentPlayerId, playerToId);
            // Reset.
            this.selectedCardIds = [];
        }
    }

    transferCards(cardIds, playerIdFrom, playerIdTo) {
        if (cardIds.length < 1) {
            return;
        }
        const deck = this.skipNewDeck ? 'hand' : 'new';
        const cardsPlayerFrom = this.filterCards(this.cards, playerIdFrom, '');
        cardsPlayerFrom.forEach((card) => {
            if (cardIds.includes(card.id)) {
                card.xClasses = this.setDefaultCardClasses(card);
                this.moveCard(card, playerIdTo, 'new');
                card.playerId = playerIdTo;
                card.deck = deck;
                card.xUpdatedAt = Date.now();
            }
        });
        this.updateCards();
        if (deck === 'new') {
            this.autoTransferNewToHand(cardIds, playerIdTo);
        }
    }

    toggleSelectCard(player, cardId, allowDuringWonScoreboard=0) {
        let maySelectCard = (player.id === this.currentPlayerId) ? 1 : 0;
        if (this.selectedCardsMax >= 0) {
            if (this.selectedCardIds.length >= this.selectedCardsMax) {
                maySelectCard = 0
            }
        }
        if (this.selectedCardsMaxOffTurn >= 0 && this.currentTurnPlayerId !== this.currentPlayerId) {
            if (this.selectedCardIds.length >= this.selectedCardsMaxOffTurn) {
                maySelectCard = 0
            }
        }
        // Block selecting if showing match, as this can lead to a bug where the selected
        // (but not yet matched) cards are also won.
        if (this.showWonCardsScoreboard && !allowDuringWonScoreboard) {
            maySelectCard = 0;
        }
        if (player.id === this.currentPlayerId || this.mayMoveAllPlayersCards) {
            let cardsSelected = 0;
            const playerCards = this.filterCards(this.cards, player.id, '');
            for (let ii = 0; ii < playerCards.length; ii++) {
                let card = playerCards[ii];
                if (card.id === cardId) {
                    const index = this.selectedCardIds.indexOf(cardId);
                    if (index > -1) {
                        this.unselectCard(card, index);
                    } else {
                        if (maySelectCard) {
                            cardsSelected++;
                            this.selectCard(card, cardId);
                        }
                    }
                    break;
                }
            }
            if (this.flashSeconds > 0 && cardsSelected > 0) {
                if (this.currentTurnPlayerId === this.currentPlayerId) {
                    // > 1 instead of > 0 per request.
                    // Must check all selected cards, not just recently selected one.
                    if (this.selectedCardIds.length > 1) {
                        this.classes.singleWonMatch.flashIt = true;
                        setTimeout(() => {
                            this.classes.singleWonMatch.flashIt = false;
                        }, this.flashSeconds * 1000);
                    }
                } else {
                    this.flashPlayer(this.currentTurnPlayerId);
                }
            }
        }
    }

    unselectAllCards() {
        if (this.selectedCardIds.length) {
            const playerCards = this.filterCards(this.cards, this.currentPlayerId, '');
            for (let ii = 0; ii < playerCards.length; ii++) {
                let card = playerCards[ii];
                if (this.selectedCardIds.includes(card.id)) {
                    if (!card.xClasses) {
                        card.xClasses = this.setDefaultCardClasses(card);
                    }
                    card.xClasses.selected = false;
                }
            }
            this.selectedCardIds = [];
        }
    }

    selectCard(playerCard, cardId) {
        this.selectedCardIds.push(cardId);
        if (!playerCard.xClasses) {
            playerCard.xClasses = this.setDefaultCardClasses(playerCard);
        }
        playerCard.xClasses.selected = true;
    }

    unselectCard(playerCard, selectedCardsIndex) {
        this.selectedCardIds.splice(selectedCardsIndex, 1);
        if (!playerCard.xClasses) {
            playerCard.xClasses = this.setDefaultCardClasses(playerCard);
        }
        playerCard.xClasses.selected = false;
    }

    transferPlayerDeckCurrentPlayer(playerId, deckTo, deckFrom='') {
        let mayMove = (playerId === this.currentPlayerId &&
            (this.mayMoveCardsOffTurn || this.currentTurnPlayerId === this.currentPlayerId))
            ? true : false;
        if (this.mayMoveAllPlayersCards) {
            mayMove = true;
        }
        if (this.selectedCardIds.length && mayMove) {
            const wonCards = [];
            const playerCards = this.filterCards(this.cards, playerId, '');
            let timeout = 0;
            // Must move cards AFTER the won cards element is visible in the DOM.
            // But must call moveCard BEFORE update card (so will have original
            // from coords).
            if (this.showWonOnScoreboard && deckTo === 'won') {
                this.showWonCardsScoreboard = true;
                timeout = 100;
            } else if (this.showWonOnScoreboard && deckFrom === 'wonCardsScoreboard') {
                // Do NOT want to timeout in this case; won section should already
                // be visible and need to move BEFORE hide it.
                timeout = 0;
            }
            setTimeout(() => {
                for (let ii = 0; ii < playerCards.length; ii++) {
                    let card = playerCards[ii];
                    const index = this.selectedCardIds.indexOf(card.id);
                    if (index > -1) {
                        playerCards[ii] = this.transferCard(card, playerId, deckTo, deckFrom);
                        if (this.showWonOnScoreboard && deckTo === 'won') {
                            wonCards.push(card);
                        }
                        this.selectedCardIds.splice(index, 1);
                        if (!this.selectedCardIds.length) {
                            break;
                        }
                    }
                }
                if (this.showWonOnScoreboard && wonCards.length) {
                    this.putWonCardsOnScoreboard(wonCards, playerId);
                }
                this.updateCards();
            }, timeout);
        }
    }

    transferCard(card, playerIdTo, deckTo, deckFrom='') {
        if (!card.xClasses) {
            card.xClasses = this.setDefaultCardClasses(card);
        }
        // this.transferPlayerDeck(playerId, card.id, deckTo, 1);
        card.xClasses.selected = false;
        if (this.showWonOnScoreboard && deckTo === 'won') {
            this.moveCard(card, '', '', `.${this.singleWonAllPlayersClass}`);
        } else if (deckFrom === 'wonCardsScoreboard') {
            this.moveCard(card, playerIdTo, deckTo, '', `.${this.singleWonAllPlayersClass}`);
        } else {
            this.moveCard(card, playerIdTo, deckTo);
        }
        card.playerId = playerIdTo;
        card.deck = deckTo;
        card.xUpdatedAt = Date.now();
        return card;
    }

    saveCardsChange(cards) {
        let cardsUpdatedCount = 0;
        for (let ii = 0; ii < this.cards.length; ii++) {
            for (let jj = 0; jj < cards.length; jj++) {
                if (cards[jj].id === this.cards[ii].id) {
                    this.cards[ii] = cards[jj];
                    cardsUpdatedCount += 1;
                }
            }
            if (cardsUpdatedCount >= cards.length) {
                break;
            }
        }
    }

    updatePlayer(player, keys=[]) {
        const playerCopy = this.plLodash.omit(player, ['xClasses', 'xStyles', 'selectingPlayerImage']);
        this.onPlayerUpdated.emit({ player: playerCopy, keys });
    }

    updateCards() {
        let cards = [];
        if (this.cards.length) {
            cards = this.cards.map((card) => {
                return this.plLodash.omit(card, ['xClasses', 'xStyles']);
            });
        }
        this.onCardsUpdated.emit({ cards: cards });
        this.checkShowArrows += 1;
    }

    updateTurnCount() {
        this.onTurnCountUpdated.emit({ turnCount: this.turnCount });
    }

    updateCardsWonScoreboard() {
        let cards = [];
        if (this.wonCardsScoreboard.cards && this.wonCardsScoreboard.cards.length) {
            cards = this.wonCardsScoreboard.cards.map((card) => {
                return this.plLodash.omit(card, ['xClasses', 'xStyles']);
            });
        }
        this.onCardsScoreboardWonUpdated.emit({ wonCardsScoreboard:
            { cards: cards, player: this.wonCardsScoreboard.player } });
    }

    toggleMayViewAllPlayers(player) {
        const indexPlayer = this.mayViewAllPlayersIds.indexOf(player.id);
        if (indexPlayer > -1) {
            this.mayViewAllPlayersIds.splice(indexPlayer, 1);
        } else {
            this.mayViewAllPlayersIds.push(player.id);
        }
        this.setMayViewPlayers();
    }

    formPlayerClassId(player) {
        return `player-id-${this.instanceId}-${player.id}`;
    }

    setDefaultPlayerClasses(player) {
        const classes: any = {};
        const classId = this.formPlayerClassId(player);
        classes[classId] = true;
        return classes;
    }

    formCardClassId(card) {
        return `card-id-${this.instanceId}-${card.uniqueId}`;
    }

    setDefaultCardClasses(card) {
        const classes: any = {};
        const classId = this.formCardClassId(card);
        classes[classId] = true;
        return classes;
    }

    moveCard(card, toPlayerId, toDeck, toSelector='', fromSelector='', facedown=0) {
        if (this.animateMoveCardsSeconds) {
            const coords: any = {
                from: fromSelector ? this.getSelectorCoords(fromSelector, 0, 0)
                    : this.getCardCoords(card),
                to: toSelector ? this.getSelectorCoords(toSelector, 0, 0)
                    : this.getCardToCoords(toPlayerId, toDeck),
            };
            if (coords.from && coords.to) {
                this.animateMovingCard(coords.from, coords.to, this.animateMoveCardsSeconds, card, facedown);
            }
        }
    }

    adjustCoordsForParent(ele, coords, cardHeight=100, cardWidth=100) {
        let boundingCoords = null;
        while (ele && ele.offsetParent && !ele.offsetParent.classList.contains('content')) {
            ele = ele.offsetParent;
            coords.left += ele.offsetLeft - ele.scrollLeft;
            coords.top += ele.offsetTop - ele.scrollTop;
            if (ele.classList.contains('player-and-card')) {
                boundingCoords = {
                    'left': ele.offsetLeft,
                    'top': ele.offsetTop,
                    'right': ele.offsetLeft + ele.offsetWidth,
                    'bottom': ele.offsetTop + ele.offsetHeight,
                };
                // Need to adjust bounding coords for offset to card part too.
                let eleBound = ele;
                while (eleBound && eleBound.offsetParent && !eleBound.offsetParent.classList.contains('content')) {
                    eleBound = eleBound.offsetParent;
                    boundingCoords.left += eleBound.offsetLeft;
                    boundingCoords.top += eleBound.offsetTop;
                    boundingCoords.right += eleBound.offsetLeft;
                    boundingCoords.bottom += eleBound.offsetTop;
                }
            }
        }
        if (boundingCoords) {
            if (coords.left < boundingCoords.left) {
                coords.left = boundingCoords.left;
            }
            if (coords.top < boundingCoords.top) {
                coords.top = boundingCoords.top;
            }
            if (coords.left + cardWidth > boundingCoords.right) {
                coords.left = boundingCoords.right - cardWidth;
            }
            if (coords.top + cardHeight > boundingCoords.bottom) {
                coords.top = boundingCoords.bottom - cardHeight;
            }
        }
        return coords;
    }

    getSelectorCoords(selector, leftBuffer, topBuffer) {
        let ele: any = document.querySelector(selector);
        if (!ele) {
            return null;
        }
        // let coords = {
        //     left: ele.offsetLeft + leftBuffer,
        //     top: ele.offsetTop + topBuffer,
        // };
        // coords = this.adjustCoordsForParent(ele, coords);

        // Find the absolute position for both the item and the parent we are moving from
        // (pl-card-game, which is the parent of the animating cards) and subtract them.
        const rect = ele.getBoundingClientRect();
        const rectAnimateParent = document.querySelector('.pl-card-game').getBoundingClientRect();
        let coords = {
            left: rect.left - rectAnimateParent.left + leftBuffer,
            top: rect.top - rectAnimateParent.top + topBuffer,
        }
        return coords;
    }

    getCardToCoords(toPlayerId, toDeck) {
        let leftBuffer = 10;
        // To account for the deck text.
        // let topBuffer = 20;
        let topBuffer = 10;
        let selector;
        let playerClassSelector = '';
        if (toPlayerId === this.dealerPlayerId) {
            selector = `.dealer .${toDeck}`;
            leftBuffer = 5;
            topBuffer += 5;
        } else {
            playerClassSelector = `.${this.formPlayerClassId({ id: toPlayerId })}`;
            selector = `${playerClassSelector} .${toDeck}`;
        }
        const coords = this.getSelectorCoords(selector, leftBuffer, topBuffer);
        return coords;
    }

    getCardCoords(card) {
        let leftBuffer = 0;
        // To account for the deck text.
        let topBuffer = 20;
        // Dealer cards are not displayed individually.
        if (card.playerId === this.dealerPlayerId) {
            return this.getCardToCoords(card.playerId, 'hand');
        }
        const selector = `.${this.formCardClassId(card)}`;
        let ele: any = document.querySelector(selector);
        if (!ele) {
            return null;
        }
        let coords = {
            left: ele.offsetLeft + leftBuffer,
            top: ele.offsetTop + topBuffer,
        };
        coords = this.adjustCoordsForParent(ele, coords);
        return coords;
    }

    animateMovingCard(fromCoords, toCoords, seconds, card, facedown=0) {
        const newCard: any = {
            id: this.plLodash.randomString(),
            xStyles: {
                left: `${fromCoords.left}px`,
                top: `${fromCoords.top}px`,
                transition: `left ${seconds}s, top ${seconds}s`,
            },
        };
        if (!facedown) {
            newCard.imageUrl = card.imageUrl;
            newCard.text = card.text;
        }
        this.cardsAnimated.push(newCard);
        this.timeouts.animatedMove = setTimeout(() => {
                // Start card moving.
                const index = this.plLodash.findIndex(this.cardsAnimated, 'id', newCard.id);
                if (index >= 0) {
                    this.cardsAnimated[index].xStyles = Object.assign(this.cardsAnimated[index].xStyles, {
                        left: `${toCoords.left}px`,
                        top: `${toCoords.top}px`,
                    });
                    // Remove card.
                    setTimeout(() => {
                        const indexToRemove = this.plLodash.findIndex(this.cardsAnimated, 'id', newCard.id);
                        this.zone.run(() => this.cardsAnimated.splice(indexToRemove));
                    },         (seconds * 1000));
                }
            }, 0);
    }

    putWonCardsOnScoreboard(cards, playerIdWon) {
        if (this.timeouts.wonCardsScoreboard) {
            clearTimeout(this.timeouts.wonCardsScoreboard);
        }
        this.showWonCardsScoreboard = true;
        this.wonCardsScoreboard = {
            player: this.getPlayerById(playerIdWon),
            cards: cards,
        }
        this.updateCardsWonScoreboard();
        // this.timeouts.wonCardsScoreboard = setTimeout(() => {
        //     this.hideWonCardsScoreboard();
        // }, (this.showWonCardsSeconds * 1000));
    }

    hideWonCardsScoreboard() {
        this.wonCardsScoreboard.cards = [];
        this.wonCardsScoreboard.player = {};
        this.showWonCardsScoreboard = false;
        this.updateCardsWonScoreboard();
    }

    toggleWonDeck(player) {
        player.wonDeckVisible = !player.wonDeckVisible;
    }

    moveToSingleWon() {
        if (this.currentPlayerId === this.currentTurnPlayerId) {
            this.transferPlayerDeckCurrentPlayer(this.currentPlayerId, 'won');
        }
    }

    flashScoreboard() {
        if (this.flashSeconds > 0) {
            this.classes.singleWonScores.flashIt = true;
            setTimeout(() => {
                this.classes.singleWonScores.flashIt = false;
            }, this.flashSeconds * 1000);
        }
    }

    acceptWonCardsScoreboard() {
        this.hideWonCardsScoreboard();
    }

    mayRejectWonCards() {
        const player = this.getPlayerById(this.currentPlayerId);
        if (!player) {
            return false;
        }
        // Just use the same privilege as viewing all players for now.
        return player.buttonMayViewAllPlayers;
    }

    rejectWonCardsScoreboard() {
        // Get cards from scoreboard and return to the current player (assumes only the
        // current turn player may win cards).
        const playerId = this.currentTurnPlayerId;
        const player = this.getPlayerById(playerId);
        const cards = this.wonCardsScoreboard.cards;
        const cardsToUpdate = [];
        cards.forEach((card) => {
            // Normally we update this.cards directly, but in this case we are iterating
            // through won cards scoreboard instead, so changes to the card do NOT
            // automatically mutate this.cards.
            card = this.transferCard(card, playerId, 'hand', 'wonCardsScoreboard');
            cardsToUpdate.push(card);
        });
        this.saveCardsChange(cardsToUpdate);
        this.updateCards();
        // Now hide won cards scoreboard.
        // Use timeout in case of animating to not remove / hide DOM element until after
        // get from coords.
        setTimeout(() => {
            this.hideWonCardsScoreboard();
        }, 50);
    }

    preSelectPlayer(playerId) {
        if (this.requirePreselectingPlayerForCardMove && this.currentPlayerId === this.currentTurnPlayerId) {
            this.playersLocal.forEach((player) => {
                // Only update if changed.
                if (playerId === player.id) {
                    player.preselectedPlayerForCardMove = !player.preselectedPlayerForCardMove;
                    player.xClasses.preselected = player.preselectedPlayerForCardMove;
                    this.updatePlayer(player, ['preselectedPlayerForCardMove']);
                // If not the new player, may still need to unselect if was previously selected.
                } else if(player.preselectedPlayerForCardMove) {
                    player.preselectedPlayerForCardMove = false;
                    player.xClasses.preselected = false;
                    this.updatePlayer(player, ['preselectedPlayerForCardMove']);
                }
            });
        }
    }

    unselectPreselectedPlayer() {
        this.playersLocal.forEach((player) => {
            if(player.preselectedPlayerForCardMove) {
                player.preselectedPlayerForCardMove = false;
                player.xClasses.preselected = false;
                this.updatePlayer(player, ['preselectedPlayerForCardMove']);
            }
        });
    }

    getPreselectedPlayerId() {
        for (let ii = 0; ii < this.playersLocal.length; ii++) {
            if (this.playersLocal[ii].preselectedPlayerForCardMove) {
                return this.playersLocal[ii].id;
            }
        }
        return '';
    }

    flashPlayer(playerId) {
        this.playersLocal.forEach((player) => {
            if (player.id === playerId) {
                // Now is a bounce on turn arrow instead.
                player.xClasses.bounceIt = true;
                setTimeout(() => {
                    player.xClasses.bounceIt = false;
                }, 3000);
                // Flash too.
                player.xClasses.flashIt = true;
                setTimeout(() => {
                    player.xClasses.flashIt = false;
                }, this.flashSeconds * 1000);
            }
        });
    }
}
