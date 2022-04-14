import { MemoryBaseController } from '../services/memory-base-controller.service';
import angular from 'angular';

class MemoryDrawerController extends MemoryBaseController {

    showPlayersSwitcher = true;
    showSettingsSwitcher = true;
    isInitialized = true;
    droppedCard: any;
    activityCards: any;
    xRay = false;
    inDrag: any;
    cardsToMove: any;
    availableCards: any;

    /**
     * @constructor
     * @param {Object} $scope
     * @param {Cards} cardsService
     * @param {ActivityModel} activityModel
     * @param {LocalStorageService} localStorage
     * @param {Object} currentUserModel
     * @param {Object} options
     * @param {Function} excludeFilter
     */
    constructor (
        private $scope,
        private cards,
        activityModel,
        localStorage,
        currentUserModel,
        options,
        private excludeFilter,
    ) {
        super(activityModel, localStorage, currentUserModel, options);

        $scope.memoryDrawerController = this;

        cards.on('dataUpdate', this.onDataUpdate);

        try {
            this.setXRay(localStorage.get(this.KEY_XRAY) === 'true');
        } catch (e) {
            console.debug('localStorage error in MemoryDrawerController');
        }
        $scope.maxFlips = 0;

        $scope.forceUpdate = 0;
        $scope.maxFlipsCollection = options.MAX_FLIPS_VALUES
            .map((num) => {
                const val = parseInt(num, 10) || 0;

                return {
                    text: num,
                    value: val,
                    onChange: () => this.selectMaxFlips(val),
                    selected: $scope.maxFlips === val,
                };
            });
    }

    onDataUpdate = (oldState, newState) => {
        if (!this.cards.isUserInput && this.isClinician()) {
            this.setXRay(false);
            this.cards.initialize(this.getDrawerCards());
        }

        this.$scope.maxFlipsCollection.forEach((item) => {
            item.selected = item.value === this.cards.maxFlipsPerTurn;
        });
        this.$scope.forceUpdate = !this.$scope.forceUpdate;

        this.isInitialized = true;
        this.$scope.$evalAsync();
    }

    selectMaxFlips(num) {
        this.cards.maxFlipsPerTurn = num;
        this.cards.save();
    }

    /**
     * Initializes cross-frame communication channel event
     * listeners
     */
    initChannel() {
        return this.getChannel().then((channel: any) => {
            channel.bind('cardDropped', (e, card) => {
                this.droppedCard = card;
            });
        });
    }

    /**
     * Adds a player to a game
     *
     * @param {string} name
     */
    addPlayer = (name) => {
        if (name) {
            this.cards.addPlayer(name).save();
        }
    }

    /**
     * Returns cards from activity model, pre-defined for this game
     *
     * @returns {Array}
     */
    getDrawerCards = () => {
        if (!this.activityCards) {
            const cards = this.activityModel.activity.config ?
                this.activityModel.activity.config.cards : [];

            this.activityCards = JSON.parse(JSON.stringify(cards || []));
        }

        return this.activityCards;
    }

    /**
     * Returns an array of cards which should be excluded from
     * activity cards
     *
     * @returns {Array}
     */
    getExcludeCards() {
        const cards = [].concat(this.cards.toArray());

        if (this.droppedCard && !~cards.map(c => c.id).indexOf(this.droppedCard.id)) {
            cards.push(this.droppedCard);
        }

        return cards;
    }

    /**
     * Remove player from a game by its index in the players collection
     * and saves new game state
     *
     * @param {number} index
     */
    removePlayer = (index) => {
        this.cards.removePlayer(index).save();
    }

    /**
     * Sets x-ray mode for a game and saves new game state
     *
     * @param {boolean} value
     */
    setXRay = (value) => {
        value = value !== undefined ? value : this.xRay;
        this.xRay = value;
        this.getChannel().then((channel: any) => {
            channel.call({
                method: 'xRayChanged',
                params: value,
            });
        });

        this.localStorage.set(this.KEY_XRAY, value);
    }

    /**
     * Sets display type for the cards and saves new game state
     *
     * @param {string} cardType - available: 'both'|'image'|'title'
     */
    setCardType(cardType) {
        this.getChannel().then((channel: any) => {
            channel.call({
                method: 'animateCards',
            });
        });

        this.cards.cardType = cardType;
        this.cards.save();
    }

    /**
     * Toggles player switcher display mode
     */
    togglePlayersSwitcher = () => {
        this.showPlayersSwitcher = !this.showPlayersSwitcher;
    }

    /**
     * Toggles settings switcher display mode
     */
    toggleSettingsSwitcher = () => {
        this.showSettingsSwitcher = !this.showSettingsSwitcher;
    }

    /**
     * Cards shuffle event handler.
     * Actually shuffles cards ona deck and saves new game state.
     */
    handleShuffleDeck () {
        this.getChannel().then((channel: any) => {
            channel.call({
                method: 'animateCards',
            });
        });

        this.cards
            .shuffle()
            .save();
    }

    /**
     * Resets cards on a deck to their initial state,
     * resets game scores, etc. and saves new game state.
     * let's say it fully restart the game.
     */
    handleRefreshDeck () {
        this.cards.reset();

        this.getChannel().then((channel: any) => {
            channel.call({
                method: 'animateCards',
            });
        });

        this.cards.save();
    }

    /**
     * Player drag start event handler
     *
     * @param {Event} event - drag start event
     * @param {number} index - player index in the players collection
     */
    handlePlayerDragStart = (event, index) => {
        event.dataTransfer.setData('index', index);
    }

    /**
     * Player drag stop event handler (player drop event handler)
     *
     * @param {Event} event - drag stop event
     * @param {number} targetIndex - target index where to put a player
     */
    handlePlayerDragStop = (event, targetIndex) => {
        let sourceIndex = parseInt(
            event.dataTransfer.getData('index'),
            10,
        );

        if (sourceIndex !== targetIndex) {
            if (sourceIndex < targetIndex) {
                [sourceIndex, targetIndex] = [targetIndex, sourceIndex];
            }

            this.cards.movePlayer(sourceIndex, targetIndex).save();
            this.$scope.$evalAsync();
        }
    }

    /**
     * Card drag start event handler
     *
     * @param {Event} e
     * @param {Object} card
     */
    handleDragCardStart = (e, card) => {
        const data = angular.toJson(card);

        this.inDrag = card.id;
        e.dataTransfer.setData('memorycard', data);

        this.$scope.$evalAsync();
    }

    /**
     * Card drag cancel event handler
     *
     * @param {Event} e
     * @param {Object} card
     */
    handleDragCardCancel = (e, card) => {
        this.getChannel().then((channel: any) => {
            channel.call({
                method: 'dragCardCancel',
            });
        });
        this.droppedCard = null;
        this.inDrag = null;
        this.$scope.$evalAsync();
    }

    /**
     * Add all cards button click handler
     * Actually it adds
     */
    addAllCards() {
        if (!this.cardsToMove) {
            return ;
        }

        while (this.cardsToMove) {
            const index = Math.floor(Math.random() * this.availableCards.length);
            const card = this.availableCards.splice(index, 1)[0];

            this.cards.add(Array(this.options.SIMILAR_LENGTH).fill(undefined).map(() =>
                JSON.parse(JSON.stringify(card)),
            ));

            this.cardsToMove--;
        }

        this.cards.shuffle().save();
    }

    /**
     * Dynamically constructs and returns a title for
     * add-all-cards button
     *
     * @returns {string}
     */
    addAllCardsTitle() {
        let title = 'Move %s to stage';
        const maxAllowedCards = Math.round(
            this.options.MAX_GRID_COLS *
            this.options.MAX_GRID_ROWS /
            this.options.SIMILAR_LENGTH,
        );
        const cardsOnDeck = Math.round(
            this.cards.length /
            this.options.SIMILAR_LENGTH,
        );
        const availableCards = this.excludeFilter(
            this.getDrawerCards(),
            this.getExcludeCards(),
        );
        const similarsName = this.options.SIMILAR_NAMES[this.options.SIMILAR_LENGTH
];

        if (cardsOnDeck + availableCards.length <= maxAllowedCards) {
            this.cardsToMove = availableCards.length;
            this.availableCards = availableCards;
            title = title.replace(/%s/, 'all ' + similarsName);
        } else {
            this.cardsToMove = maxAllowedCards - cardsOnDeck;
            this.availableCards = availableCards;
            title = title.replace(/%s/, `${this.cardsToMove} ${similarsName}`);
        }

        return  title;
    }
}

const memoryDrawerController = angular.module('toys').controller('memoryDrawerController', [
    '$scope',
    'Cards',
    'activityModel',
    'localStorageService',
    'currentUserModel',
    'MEMORY_CARDS_OPTIONS',
    'excludeFilter',
    MemoryDrawerController,
]);
