import * as EventEmitter from 'events';
import { DynamicGrid } from './dynamic-grid.service';
import angular from 'angular';
import { propertyOf } from 'lodash';

/**
 * Class Cards - Memory cards service object implementation
 */
class Cards extends EventEmitter {
    model: any;
    playersInitialized = false;
    colours = [];
    initialized = false;
    stateLink: any;
    dataValueHandler: any;
    length: number;
    grid: DynamicGrid;
    metadata: any;


    /**
     * Constructs and returns generic model object with default initial values
     *
     * @returns {{
     *  turn: number,
     *  pairs: number,
     *  cardType: string,
     *  cards: Array,
     *  score: Array,
     *  players: Array,
     *  turnOpenCards: Array
     *  isUserInput: boolean,
     *  animated: boolean,
     *  maxFlipsPerTurn: number,
     *  turnFlips: number,
     *  turnPaused: boolean,
     *  expectedCards: Array,
     *  unmatched: number[],
     *  uuid: string,
     *  matched: string
     * }}
     */
    static defaultModel() {
        return {
            turn: 0,
            pairs: 0,
            cardType: 'both',
            cards: [],
            score: [],
            players: [],
            turnOpenCards: [],
            cardsOrder: [],
            isUserInput: false,
            animated: true,
            turnFlips: 0,
            turnPaused: false,
            expectedCards: [],
            unmatched: [],
            uuid: '',
            matched: ''
        };
    }


    /**
     * @property {boolean} isUserInput
     * @readonly
     */
    get isUserInput() {
        return this.model.isUserInput;
    }
    set isUserInput(yesNo) {
        throw new TypeError('trying to modify read-only property isUserInput!');
    }

    /**
     * @property {string} cardType
     */
    get cardType() {
        return this.model.cardType;
    }
    set cardType(type) {
        if (this.model.cardType !== type) {
            this.model.cardType = type;
            this.updatePositions().save(undefined);
        }
    }

    /**
     * @property {boolean} animated
     */
    get animated() {
        return !!this.model.animated;
    }
    set animated(val) {
        this.model.animated = val;
    }

    /**
     * @property {number} pairs
     */
    get similars() {
        return this.model.pairs;
    }
    set similars(val) {
        this.model.pairs = val;
    }

    /**
     * @property score
     */
    get score() {
        return this.model.score;
    }
    set score(val) {
        this.model.score = val;
    }

    /**
     * @property {number} turn
     */
    get turn() {
        return this.model.turn;
    }
    set turn(val) {
        this.model.turn = val;
    }

    /**
     * @property {number} maxFlipsPerTurn
     */
    get maxFlipsPerTurn() {
        return this.model.maxFlipsPerTurn || 0;
    }
    set maxFlipsPerTurn(maxFlips) {
        this.model.maxFlipsPerTurn = parseInt(maxFlips, 10) || 0;
    }

    /**
     * @property {number} turnFlips
     */
    get turnFlips() {
        return  this.model.turnFlips || 0;
    }
    set turnFlips(flips) {
        this.model.turnFlips = parseInt(flips, 10) || 0;
    }

    get turnPaused() {
        return this.model.turnPaused;
    }
    set turnPaused(val) {
        this.model.turnPaused = !!val;
    }

    /**
     * @property {{
     *   name: string,
     *   color: string
     * }[]} players
     */
    get players() {
        if (!this.playersInitialized) {
            const playerColors = (this.model.players || []).map((p) => p.color);

            this.playersInitialized = true;

            this.model.players.forEach((player) => {
                if (!player.color) {
                    player.color = this.colours.filter((c) =>
                        !~playerColors.indexOf(c)
                    )[0];
                }
            });
            // Need to save, otherwise if back out of activity and come back, player has
            // no color and score is not counted; gets into a dead state.
            this.save(this.model);
        }

        return this.model.players;
    }
    set players(players) {
        this.model.players = players;
        this.playersInitialized = false;

        // TODO - unclear what this was meant to do...
        // this.players;
    }

    /**
     * @property {Array} cards
     */
    get cards() {
        return this.model.cards;
    }
    set cards(cards) {
        this.model.cards = cards;
    }

    /**
     * @property {Array} cards
     */
    get turnOpenCards() {
        return this.model.turnOpenCards;
    }
    set turnOpenCards(turnOpenCards) {
        this.model.turnOpenCards = turnOpenCards;
    }

    /**
     * @property {Array} cardsOrder
     */
    get cardsOrder() {
        return this.model.cardsOrder;
    }
    set cardsOrder(order) {
        this.model.cardsOrder = order;
    }

    /**
     * Array of last unmatched card indexes
     *
     * @property {number[]}
     */
    get unmatched() {
        return this.model.unmatched;
    }
    set unmatched(indices) {
        this.model.unmatched = indices;
    }

    /**
     * Current instance identifier
     *
     * @property {string}
     */
    get uuid() {
        return this.model.uuid;
    }
    set uuid(id) {
        throw new TypeError('Trying to modify read-only property!');
    }

    /**
     * Last matched card identifier
     *
     * @property {string}
     */
    get matched() {
        return this.model.matched;
    }
    set matched(id) {
        this.model.matched = id;
    }

    /**
     * Returns card ids expected to be matched
     *
     * @returns {Array}
     */
    get expectedCards() {
        return this.model.expectedCards;
    }
    /**
     * Sets card ids expected to be matched
     * @param {Array} ids
     */
    set expectedCards(ids) {
        this.model.expectedCards = ids;
    }

    /**
     * @event Cards#dataUpdate
     */

    /**
     * @constructor
     * @param {Object} options
     */
    constructor(private options, private activityModel, private firebaseAppModel, private $timeout, private guidService) {
        super();
        this.cleanModel();
    }

    /**
     * Initializes clean state of the model
     * This could be useful whenever it is required to re-initialize the model state
     *
     * @returns {Cards}
     */
    cleanModel() {
        this.removeAllListeners('dataUpdate');
        this.removeAllListeners('match');
        this.removeAllListeners('matchFail');

        if (this.stateLink) {
            this.stateLink.off('value', this.dataValueHandler);
        }

        const uuid = this.guidService.generateUUID();

        /**
         * @access private
         * @property {{
         *  turn: number,
         *  pairs: number,
         *  cardType: string,
         *  cards: Array,
         *  score: Array,
         *  players: Array,
         *  turnOpenCards: Array,
         *  isUserInput: boolean,
         *  maxFlipsPerTurn: number,
         *  turnFlips: number,
         *  turnPaused: boolean,
         *  unmatched: number[],
         *  uuid: string,
         *  matched: string
         * }} model
         * @memberof Cards
         */
        this.model = Cards.defaultModel();
        this.model.uuid = uuid;

        /**
         * @property {number} length - quantity of the cards available in the current model
         * @memberof Cards
         */
        this.length = 0;

        /**
         * Predefined set of player colors
         *
         * @property {string[]} colors - array of player color names
         * @memberof Cards
         * @access private
         */
        this.colours = ['blue', 'pink', 'green', 'orange'];

        /**
         * @access private
         * @property {DynamicGrid} grid
         */
        this.grid = new DynamicGrid(undefined);

        return this.clear(undefined);
    }

    /**
     * Init Firebase
     */
    updateData() {
        this.activityModel.foundationLoaded.then(() => {
            this.initFirebase();
        });
    }

    /**
     * Performs initial pre-set of the cards deck with the given
     * cards objects if the deck was never initialized by a user
     *
     * @param {Object[]} cards
     * returns {Cards}
     */
    initialize(cards) {
        if (this.length || this.isUserInput || !(cards && cards.length)) {
            return this; // nothing to do
        }

        const similars = this.options.SIMILAR_LENGTH;
        const maxCards = this.options.MAX_GRID_COLS *
            this.options.MAX_GRID_ROWS /
            similars;

        this.add.apply(this, cards
            .filter((c, i, arr) => arr.map((C) => C.id).indexOf(c.id) === i)
            .slice(0, Math.round(maxCards))
            .map((c) => Array(similars).fill(undefined).map(() => JSON.parse(JSON.stringify(c))))
        );

        this.model.isUserInput = true;

        return this.shuffle().save(undefined);
    }

    /**
     * Initializes firebase model state link
     *
     * @fires Cards#dataUpdate
     * @returns {Cards}
     * @access private
     */
    initFirebase() {
        let queueId = propertyOf(this.firebaseAppModel.app)('activeActivity.queueId');

        if (!queueId) {
            queueId = 'STORE_ACTIVITY';
        }

        let activityId = propertyOf(this.firebaseAppModel.app)('activeActivity.activityId');

        if (!activityId) {
            activityId = 'ACTIVITY_ID';
        }

        const activityLink = this.activityModel.getRef('activities')
            .child('queues')
            .child('items')
            .child(queueId)
            .child('items')
            .child(activityId)
            .child('memory');

        /**
         * @access private
         * @property {XMLList} stateLink
         */
        this.stateLink = activityLink.child('state');

        this.dataValueHandler = (stateObj) => {
            const oldState = JSON.parse(JSON.stringify(this.model));
            let state = stateObj.val();
            const defState = Cards.defaultModel();

            if (!state) {
                state = defState;
            } else {
                state.score = state.score || defState.score;
                state.cards = state.cards || defState.cards;
                state.players = state.players || defState.players;
                state.turnOpenCards = state.turnOpenCards ||
                    Array(state.cards.length).fill(undefined).map(() => false);
                state.cardsOrder = state.cardsOrder ||
                    state.cards.map((c, i) => i);
                state.turn = state.turn || defState.turn;
                state.pairs = state.pairs || defState.pairs;
                state.unmatched = state.unmatched || defState.animated;
                state.matched = state.matched || defState.matched;
                state.animated = state.animated || defState.animated;
                state.expectedCards = state.expectedCards || defState.expectedCards;
            }

            this.updateModel(state);

            if (state.uuid !== this.uuid || !this.initialized)  {
                this.emit('dataUpdate', state, oldState);
                this.initialized = true;
            }

            return state;
        };

        this.stateLink.off('value', this.dataValueHandler);
        this.stateLink.on('value', this.dataValueHandler);

        return this;
    }

    /**
     * Pushes current cards state to firebase
     *
     * @param {Object} [model]
     * @returns {Cards}
     */
    save(model) {
        if (model) {
            this.updateModel(model);
        }
        const data = angular.fromJson(angular.toJson(this.model));
        if (this.stateLink) {
            this.stateLink.set(data);
        }
        return this;
    }

    /**
     * Returns array representation of the cards data from current model
     *
     * @returns {Array}
     */
    toArray() {
        return this.cards;
    }

    /**
     * Returns true if card marked as visible false otherwise
     *
     * @param {Object|number} card - card itself or it's index in the cards array
     * @returns {boolean}
     */
    isVisible(card) {
        const cardIndex = typeof card === 'number' ? card : this.indexOf(card);
        let visible = false;

        if (~cardIndex) {
            visible = !!this.cards[cardIndex].visible;
        }

        return visible;
    }

    /**
     * Returns true if card was opened in current turn, false otherwise
     *
     * @param {Object|number} card - card itself or its index
     * @return {boolean}
     */
    isOpenedInCurrentTurn(card) {
        card = typeof card === 'number' ? card : this.indexOf(card);

        if (~card) {
            return !!this.turnOpenCards[card];
        }

        return false;
    }

    /**
     * Sets  given card(s) visible in the current turn
     *
     * @param {...Object|number} card - card or its index, each argument could be an array
     * @param {boolean} [lookupMatches] - set to true if you want count matches on setting card visible
     * @return {Cards}
     */
    setVisible() {
        const args = Array.prototype.slice.call(arguments);
        let flag = args[args.length - 1];

        if (flag === true) {
            args.pop();
        } else {
            flag = false;
        }

        const cards = this.argsToCards(args);

        if (!this.expectedCards) {
            this.expectedCards = [];
        }

        cards.forEach((card) => {
            card.visible = true;
            this.turnOpenCards[this.indexOf(card)] = true;

            if (flag) {
                const expected = this.expectedCards.indexOf(card.id);

                if (~expected) {
                    this.expectedCards.splice(expected, 1);

                    this.turnFlips = 0;

                    if (this.expectedCards && this.expectedCards.length) {
                        const cardsToHide = this.expectedCards.map((id) =>
                            this.cards.filter(($card) =>
                                $card.id === id && $card.visible
                            )[0]
                        ).filter((c) => !!c);

                        if (cardsToHide.length) {
                            this.setHidden(cardsToHide);
                        }

                        this.expectedCards = [];
                    }

                    this.matched = card.id;

                    this.emit('match', card);
                } else {
                    this.expectedCards.push(card.id);
                    if (this.maxFlipsPerTurn) {
                        this.turnFlips++;
                    }
                }
            }
        });

        if (flag && this.maxFlipsPerTurn && this.turnFlips >= this.maxFlipsPerTurn) {
            this.turnPaused = true;
            this.findUnmatched()
                .emit('matchFail', this.expectedCards);

            this.expectedCards = [];
        }

        return this;
    }

    /**
     * Calculates and remembers currently unmatched cards to a local state
     *
     * @returns {Cards}
     */
    findUnmatched() {
        this.expectedCards = this.expectedCards || [];

        this.unmatched = this.cards.map(($card, index) =>
            ~this.expectedCards.indexOf($card.id) && $card.visible ?
                index : null
        ).filter((index) => index !== null);

        return this;
    }

    /**
     * Sets  given card(s) hidden in the current turn
     * If no arguments given sets all cards in the current model to hidden.
     *
     * @param {...Object|number} card - card or its index, each argument could be an array
     * @return {Cards}
     */
    setHidden(cardsToHide) {
        const args = Array.prototype.slice.call(arguments);
        let flag = args[args.length - 1];

        if (flag === true) {
            args.pop();
        } else {
            flag = false;
        }

        let cards = this.argsToCards(args);

        if (!(cards && cards.length)) {
            cards = this.cards;
        }

        cards.forEach((card) => {
            card.visible = false;
            this.turnOpenCards[this.indexOf(card)] = false;

            if (flag) {
                const expected = this.expectedCards.indexOf(card.id);
                const hasOpenedPair = false;

                // TODO - unclear what 'similar' is for
                // let similar = this.getSimilar(card).indices.some((index) => {
                //     if (this.turnOpenCards[index]) {
                //         return (hasOpenedPair = true);
                //     }
                // });

                if (!~expected && hasOpenedPair) {
                    this.expectedCards.push(card.id);
                    if (this.maxFlipsPerTurn) {
                        this.turnFlips++;
                    }
                } else if (!hasOpenedPair) {
                    if (~expected) {
                        this.expectedCards.splice(expected, 1);
                    }
                    if (this.maxFlipsPerTurn) {
                        this.turnFlips--;
                    }
                }

                this.findUnmatched();
            }
        });

        return this;
    }

    /**
     * Resets all cards in the model to default state
     *
     * @returns {Cards}
     */
    reset() {
        const defs = Cards.defaultModel();

        this.turn = defs.turn;
        this.similars = defs.pairs;
        this.score = defs.score;
        this.turnPaused = defs.turnPaused;
        this.turnFlips = defs.turnFlips;
        this.turnOpenCards = Array(this.cards.length).fill(undefined).map(() => false);
        this.unmatched = defs.unmatched;
        this.matched = defs.matched;
        this.animated = defs.animated;
        this.expectedCards = defs.expectedCards;

        return this.setHidden([]);
    }

    /**
     * Returns position index of the given card in the cards array of the model
     *
     * @param {Object} card
     */
    indexOf(card) {
        let index = -1;

        this.cards.some((c, i) => {
            if (c === card) {
                index = i;
                return true;
            }
        });

        return index;
    }

    /**
     * Traversing cards with the given function
     *
     * @param {Function} fn
     * @returns {Cards}
     */
    forEach(fn) {
        this.cards.forEach(fn);
        return this;
    }

    /**
     * Returns card by its index
     *
     * @param {number} index
     * @returns {{
     *  id: string,
     *  thumbnail_url: string,
     *  top: number,
     *  left: number,
     *  visible: boolean
     * }}
     */
    get(index) {
        return this.cards[index];
    }

    /**
     * Updates score table for all players in a game due to the current
     * cards open state
     *
     * @params {number} [hideCardIndex] - index of the cards which has been hidden during last action (if required)
     * @returns {Cards}
     */
    updateGameScores(hideCardIndex) {
        if (!this.hasTurns()) {
            return this;
        }

        const occurrences = {};

        for (let i = 0; i < this.length; i++) {
            const card = this.cards[i];
            const visible = this.isVisible(i);

            if (visible) {
                if (occurrences[card.id]) {
                    occurrences[card.id]++;
                } else {
                    occurrences[card.id] = 1;
                }
            }
        }

        let similars = 0;

        for (let i = 0; i < this.length; i++) {
            const card = this.cards[i];

            if ((occurrences[card.id] || 0) < this.options.SIMILAR_LENGTH) {
                if (hideCardIndex === undefined) {
                    this.cards[i].visible = false;
                } else if (hideCardIndex === i && occurrences[card.id]) {
                    this.score[this.turn]--;
                }
            } else {
                similars++;
            }
        }

        similars /= this.options.SIMILAR_LENGTH;

        if (this.similars !== similars) {
            const delta = similars - (this.similars || 0);

            this.score[this.turn] = this.score[this.turn] || 0;
            this.score[this.turn] += delta < 1 ? 0 : delta;
        }

        this.similars = similars;

        if (!this.hasTurns()) {
            // game is over, so deny flipping cards in the current turn
            this.freezeTurn();
        }

        return this;
    }

    /**
     * Freezes turn open cards to make them non-interactive
     */
    freezeTurn() {
        for (let i = 0; i < this.length; i++) {
            this.model.turnOpenCards[i] = false;
        }
    }

    /**
     * Process turn in cards game
     */
    endTurn() {
        this.turnPaused = false;
        this.expectedCards = [];
        this.updateGameScores(undefined);

        this.freezeTurn();

        this.turn++;
        this.turnFlips = 0;

        if (this.turn >= this.players.length) {
            this.turn = 0;
        }

        return this;
    }

    /**
     * Returns true if current game has turns to proceed,
     * false otherwise
     *
     * @returns {boolean}
     */
    hasTurns() {
        return this.similars < this.cards.length / this.options.SIMILAR_LENGTH;
    }

    /**
     * Sets cards model reference to this service
     *
     * @param {Object} model
     * @returns {Cards}
     */
    updateModel(model) {
        model = model || this.model;

        const hasGridChange = this.length !== model.cards.length ||
            model.cardType !== this.model.cardType;

        for (const prop in model) {
            if (prop !== 'uuid') {
                this.model[prop] = model[prop];
            }
        }

        if (hasGridChange) {
            this.grid.update(this.getGridOptions());
        }

        this.length = this.cards.length;

        if (this.length) {
            this.model.isUserInput = true;
        }

        return this.clear('shapes');
    }

    /**
     * Clears the state of the service.
     * This usually should happen automatically if cards model changed.
     * It will clear all cached data related to an old cards model.
     * If key argument is specified it will clean-up only a given
     * part of metadata.
     *
     * @param {string} [key] - key if only part of metadata should be cleared
     * @returns {Cards}
     */
    clear(key) {
        /**
         * @property {{
         *  highlighted: Array,
         *  selected: Array,
         *  shapes: Array,
         *  cols: number,
         *  rows: number
         * }} metadata
         * @memberof Cards
         * @access private
         */
        if (!this.metadata || key === undefined) {
            this.metadata = {
                highlighted: [],
                selected: [],
                shapes: [],
                cols: 0,
                rows: 0
            };
        } else if (this.metadata[key] !== undefined) {
            this.metadata[key] = ~['cols', 'rows'].indexOf(key) ? 0 : [];
        }

        return this;
    }

    /**
     * Randomly shuffle cards in a model
     *
     * @returns {Cards}
     */
    shuffle() {
        for (let i = 0; i < this.cardsOrder.length; i++) {
            const j = Math.floor(Math.random() * this.cards.length);

            const tmp = this.cardsOrder[i];
            this.cardsOrder[i] = this.cardsOrder[j];
            this.cardsOrder[j] = tmp;
        }

        return this.updatePositions();
    }

    /**
     * Returns an object having similar cards array and
     * array of their indexes found in the current cards model
     *
     * @param {Object|number} card - cards object or it's index in the model array
     * @returns {{ cards: {Object}[], indices: {number}[] }}
     */
    getSimilar(card) {
        if (typeof card === 'number') {
            card = this.cards[card];
        }

        if (!card) {
            return null;
        }

        const cards = [];
        const indices = [];

        for (let i = 0, s = this.cards.length; i < s; i++) {
            if (card.id === this.cards[i].id) {
                cards.push(this.cards[i]);
                indices.push(i);
            }
        }

        if (!cards.length) {
            return null;
        }

        return {
            cards: cards,
            indices: indices
        };
    }

    /**
     * @access private
     */
    argsToCards(args) {
        let cards = [];

        args = Array.prototype.slice.call(args, 0);

        if (!args.length) {
            return [];
        }

        args.forEach((cardsArg) => {
            if (!(cardsArg instanceof Array)) {
                cardsArg = [cardsArg];
            }

            cards = cards.concat(cardsArg);
        });

        return cards
            .map((card) =>
                typeof card === 'number' ?
                    this.cards[card] : card
            );
    }

    /**
     *
     * @param args
     * @returns {*}
     */
    argsToUniqueCards(args) {
        return this.argsToCards(args)
            .filter((card, pos, arr) =>
                arr.map((c) => c.id).indexOf(card.id) === pos
            );
    }

    /**
     * Adds given card or cards to selection.
     * It is possible to specify as many card arguments as needed.
     * Each card argument could be card object or it's numeric index in the model
     *
     * @param {...Object|number} [card]
     * @returns {Cards}
     */
    select() {
        const cards = this.argsToCards(arguments)
            .filter((card) =>
                !~this.metadata.selected.map((c) => c.id).indexOf(card.id)
            );

        this.metadata.selected.push.apply(
            this.metadata.selected, cards
        );

        return this;
    }

    /**
     * Removes given card or cards from selection.
     * It is possible to specify as many card arguments as needed.
     * Each card argument could be card object or it's numeric index in the model
     * if no arguments bypassed will clear all selection.
     *
     * @param {...Object|number} [card]
     * @returns {Cards}
     */
    deselect() {
        if (!arguments.length) {
            return this.clear('selected');
        }

        const cards = this.argsToCards(arguments)
            .filter((card) =>
                ~this.metadata.selected.map((c) => c.id).indexOf(card.id)
            );

        cards.forEach((card) => {
            const orderedIndices = this.metadata.selected.map((c, i) => {
                return c.id === card.id ? i : null;
            }).filter((i) => i !== null).sort();

            for (let i = orderedIndices.length - 1; i >= 0; i--) {
                this.metadata.selected.splice(orderedIndices[i], 1);
            }
        });

        return this;
    }

    /**
     * This will remove cards marked as selected from the current model
     *
     * @returns {Cards}
     */
    removeSelected() {
        return this.remove(this.metadata.selected).deselect();
    }

    /**
     * Removes a player from a list of active players and gives
     * a turn to the next player if player was at active turn
     *
     * @param {number} index - player index in the players list
     * @returns {Cards}
     */
    removePlayer(index) {
        this.players.splice(index, 1);
        this.score.splice(index, 1);

        if (index === this.turn) {
            this.freezeTurn();
        }

        if (this.turn >= this.players.length) {
            this.turn = 0;
        }

        if (!this.players.length) {
            this.reset();
        }

        return this;
    }

    /**
     * Adds a new player to the current cards game
     *
     * @param {string} name
     * @returns {Cards}
     */
    addPlayer(name) {
        this.players.push({
            name: name
        });

        this.playersInitialized = false;

        // TODO - unclear what this was for
        // this.players;

        return this;
    }

    /**
     * Moves player from a given sourceIndex position to a given targetIndex
     * position
     *
     * @param {number} targetIndex
     * @param {number} sourceIndex
     * @returns {Cards}
     */
    movePlayer(sourceIndex, targetIndex) {
        const targetPlayer = this.players[targetIndex];
        const sourcePlayer = this.players[sourceIndex];
        const sourceScore = this.score[sourceIndex];

        this.players.splice(sourceIndex, 1);

        // re-target index as far as array changed
        targetIndex = this.players.indexOf(targetPlayer);

        this.players.splice(targetIndex, 0, sourcePlayer);

        this.score.splice(sourceIndex, 1);
        this.score.splice(targetIndex, 0, sourceScore);

        return this;
    }

    /**
     * Returns true if all the given cards are selected,
     * false otherwise.
     * It is possible to specify as many card arguments as needed.
     * Each card argument could be card object or it's numeric index in the model
     *
     * @param {...Object|number} [card]
     * @returns {boolean}
     */
    isSelected() {
        const cards = this.argsToCards(arguments);
        const selected = this.metadata.selected.map((c) => c.id);

        return !cards.some((card) => {
            return !~selected.indexOf(card.id);
        });
    }

    /**
     * Returns true if some of the cards in the model marked as selected,
     * false otherwise
     *
     * @returns {boolean}
     */
    hasSelected() {
        return this.metadata.selected.length > 0;
    }

    /**
     * Marks all given card(s) as highlighted
     * It is possible to specify as many card arguments as needed.
     * Each card argument could be card object or it's numeric index in the model
     *
     * @param {...Object|number} [card]
     * @returns {Cards}
     */
    highlight() {
        const cards = this.argsToCards(arguments).filter((card) =>
            !~this.metadata.highlighted.map((c) => c.id).indexOf(card.id)
        );

        this.metadata.highlighted.push.apply(
            this.metadata.highlighted, cards
        );
    }

    /**
     * Clears all highlights
     *
     * @returns {Cards}
     */
    dehighlight() {
        return this.clear('highlighted');
    }

    /**
     * Returns true if all the given cards highlighted,
     * false otherwise.
     * It is possible to specify as many card arguments as needed.
     * Each card argument could be card object or it's numeric index in the model
     *
     * @param {...Object|number} [card]
     * @returns {boolean}
     */
    isHighlighted() {
        const cards = this.argsToCards(arguments);
        const highlighted = this.metadata.highlighted.map((c) => c.id);

        return !cards.some((card) =>
            !~highlighted.indexOf(card.id)
        );
    }

    /**
     * Returns true if at least one card highlighted, false otherwise
     *
     * @returns {boolean}
     */
    hasHighlighted() {
        return this.metadata.highlighted.length > 0;
    }

    /**
     * Returns pre-calculated positions for the cards on a whiteboard
     * If cards linked to the model has been changed it will automatically
     * do re-calculation of the positions.
     *
     * @returns {{top: number, left: number}[]}
     */
    getPositions() {
        return this.cards.map((card) => ({ top: card.top, left: card.left }));
    }

    /**
     * Constructs and returns actual grid options for a current
     * cards deck state
     *
     * @returns {{
     *  length: number,
     *  cellWidth: number,
     *  cellHeight: number,
     *  boardWidth: number,
     *  boardHeight: number,
     *  maxRows: number,
     *  maxCols: number,
     *  proportion: number,
     *  cellPaddingHorizontal: number,
     *  cellPaddingVertical: number,
     *  responsiveCell: boolean,
     *  boardPadding: number
     * }}
     * @access protected
     */
    getGridOptions() {
        const options = this.options;
        const cards = this.cards;

        return {
            length: cards.length,
            cellWidth: options.CARD_WIDTH,
            cellHeight: this.cardType === 'both' ?
                options.CARD_HEIGHT :
                options.CARD_WIDTH,
            boardWidth: options.BOARD_WIDTH -
                options.TOOLBAR_WIDTH,
            boardHeight: options.BOARD_HEIGHT,
            maxRows: options.MAX_GRID_ROWS,
            maxColumns: options.MAX_GRID_COLS,
            proportion: options.GRID_PROPORTION,
            cellPaddingHorizontal: options.HORIZONTAL_PADDING,
            cellPaddingVertical: options.VERTICAL_PADDING,
            responsiveCell: options.RESPONSIVE_CARDS,
            boardPadding: options.BOARD_PADDING
        };
    }

    /**
     * Updates positions for the cards on a deck
     * correspondingly to current grid layout and cards order
     *
     * @returns {Cards}
     */
    updatePositions() {
        // make sure our grid is up-to-date for the current
        // cards collection length
        const positions = this.grid.update(this.getGridOptions()).positions;

        // update cards positions correspondingly to their current order
        this.cardsOrder.forEach((cardIndex, positionIndex) => {
            if (!(this.cards[cardIndex] && positions[positionIndex])) {
                return ;
            }

            Object.assign(
                this.cards[cardIndex],
                positions[positionIndex]
            );
        });

        return this;
    }

    /**
     * Returns pre-calculated shape boxes for each card.
     * Card shape consists of three elements:
     *  1). left box
     *  2). main box
     *  3). right box
     *  Left and right boxes are areas which are responsible for
     *  initiating of the card insertion markers, main box is the
     *  area, which is responsible for initiating replace marker
     *
     * @returns {{
     *      left:  { top: number, right: number, bottom: number, left: number },
     *      main:  { top: number, right: number, bottom: number, left: number },
     *      right: { top: number, right: number, bottom: number, left: number }
     * }[]}
     */
    getShapes() {
        if (this.cards.length === this.metadata.shapes.length) {
            // seems nothing has been changed
            return this.metadata.shapes;
        }

        const o = this.options;
        const cardWidth = this.grid.cellWidth;
        const cardHeight = this.grid.cellHeight;
        const horizontalPadding = o.HORIZONTAL_PADDING;
        const margin = o.DROP_MARGIN;
        const halfVPad = Math.round(o.VERTICAL_PADDING / 2);
        const halfHPad = Math.round(o.HORIZONTAL_PADDING / 2);

        this.getPositions().forEach((pos) => {
            const top = pos.top - halfVPad;
            const btm = pos.top + cardHeight + halfVPad;
            const leftMargin = pos.left + margin;
            const rightMargin = pos.left + cardWidth - margin;

            const shapes = {
                left: {
                    top: top,
                    right: leftMargin,
                    bottom: btm,
                    left: pos.left - halfHPad
                },
                main: {
                    top: top,
                    right: rightMargin,
                    bottom: btm,
                    left: leftMargin
                },
                right: {
                    top: top,
                    right: pos.left + cardWidth + halfHPad,
                    bottom: btm,
                    left: rightMargin
                }
            };

            this.metadata.shapes.push(shapes);
        });

        return this.metadata.shapes;
    }

    /**
     * Returns index of a card which should be drawn
     * at the given coordinates x, y
     * If lookup faild it will return -1
     *
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    indexOfXY(x, y) {
        let index = -1;
        const allShapes = this.getShapes();

        allShapes.some((shapes, i) => {
            let last = 'main';

            if (
                !((i + 1) in allShapes) ||
                allShapes[i + 1].main.top !== shapes.main.top
            ) {
                last = 'right';
            }

            if (
                x >= shapes.left.left && x <= shapes[last].right &&
                y >= shapes.main.top && y <= shapes.main.bottom
            ) {
                index = i;
                return true;
            }
        });

        return index;
    }

    /**
     * Returns pre-calculated position for the specified card
     *
     * @param {Object|number} card
     * @returns {{top: number, left: number, width: number, height: number}}
     */
    getPosition(card) {
        card = typeof card === 'number' ? this.cards[card] : card;

        return {
            top: card.top,
            left: card.left,
            width: card.width,
            height: card.height
        };
    }

    /**
     * Inserts given cards before the card with the given index,
     * which should be passed as a last argument to this method.
     *
     * @param {...Object|Object[]|number|number[]} card
     * @param {number} index
     * @return {Cards}
     */
    insert() {
        const cards = sliceCards(arguments);
        const index = cards.pop(); // this is card index

        this.cards.push.apply(
            this.cards, cards
        );
        this.turnOpenCards.push.apply(
            this.turnOpenCards,
            cards.map(() => false)
        );

        cards.forEach((c, i) => {
            this.cardsOrder.splice(
                index, 0,
                this.length + i
            );
        });

        this.length = this.cards.length;

        return this.updatePositions();
    }

    /**
     * Replaces given old cards with the given new cards
     * Length of the new and old given cards must be equal
     *
     * @param {number[]|Object[]} oldCards
     * @param {Object[]} newCards
     * @returns {Cards}
     */
    replace(oldCards, newCards) {
        if (oldCards.length !== newCards.length) {
            throw new TypeError('Given cards arguments are invalid!');
        }

        if (!(oldCards instanceof Array)) {
            oldCards = [oldCards];
        }

        const indices = oldCards.map((card) => {
            if (typeof card !== 'number') {
                card = this.indexOf(card);
            }

            return card;
        }).filter((i) => typeof i === 'number');

        indices.forEach((index, i) => {
            this.cards.splice(index, 1, newCards[i]);
            this.turnOpenCards[index] = false;
        });

        this.length = this.cards.length;

        return this.updatePositions();
    }

    /**
     * Returns all cards by a given card identifier
     *
     * @param {string} id
     * @returns {Object[]}
     */
    getCardsById(id) {
        return this.cards.filter((card) => card.id === id);
    }

    /**
     * Returns cards indices in the collection of cards by a given card identifier
     *
     * @param {string} id
     * @returns {number[]}
     */
    getCardIndicesById(id) {
        return this.cards
            .map((card, index) => card.id === id ? index : null)
            .filter((index) => index !== null);
    }

    /**
     * Adds given cards to the current model
     * It is possible to specify as many card arguments as needed.
     * Each card argument could be card object or it's numeric index in the model
     *
     * @param {...Object|Object[]|number|number[]} [card]
     * @returns {Cards}
     */
    add() {
        const cards = sliceCards(arguments);

        this.cards.push.apply(
            this.cards, cards
        );
        this.turnOpenCards.push.apply(
            this.turnOpenCards,
            cards.map(() => false)
        );
        cards.forEach((c, i) =>
            this.cardsOrder.push(this.length + i));

        this.length = this.cards.length;

        return this.updatePositions();
    }

    /**
     * Removes given cards from current model
     * It is possible to specify as many card arguments as needed.
     * Each card argument could be card object or it's numeric index in the model
     * if no arguments bypassed will clear all selection.
     *
     * @param {...Object|number} [card]
     * @returns {Cards}
     */
    remove(cardsToRemove) {
        let orderedIndexes = [];

        this.argsToCards(arguments).forEach((card) => {
            orderedIndexes = orderedIndexes.concat(this.cards.map((c, i) => {
                return c.id === card.id ? i : null;
            }));
        });

        // by default js Array.prototype.sort() works as the values are strings, so
        // for numbers it works wrong, that is why we need our own sort function here
        orderedIndexes.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);

        // remove indexes duplicates
        orderedIndexes = orderedIndexes.filter((i, pos, arr) => i !== null && arr.indexOf(i) === pos);

        for (let i = 0, s = orderedIndexes.length; i < s; i++) {
            this.cards.splice(orderedIndexes[i], 1);
            this.turnOpenCards.splice(orderedIndexes[i], 1);
            this.cardsOrder.splice(this.cardsOrder.indexOf(orderedIndexes[i]), 1);

            // now we need to fix values stored in cardOrders,
            // decreasing those which are higher than the
            // removed card index
            for (let j = 0; j < this.cardsOrder.length; j++) {
                if (this.cardsOrder[j] >= orderedIndexes[i]) {
                    this.cardsOrder[j]--;
                }
            }
        }

        this.length = this.cards.length;

        // if we removed all cards, make sure we reset all related data
        if (!this.length) {
            const defModel = Cards.defaultModel();

            delete defModel.players;
            delete defModel.isUserInput;
            delete defModel.cardType;
            delete defModel.animated;

            Object.assign(this.model, defModel);
        }

        return this.updatePositions();
    }

    /**
     * Returns card by a given coordinates
     *
     * @param {number} x
     * @param {number} y
     * @param {number} [scale]
     * @returns {Object}
     */
    getCardByXY(x, y, scale) {
        let card = null;

        scale = scale !== undefined && scale >= 0 ? scale : 1;

        this.getShapes().some((shape, i) => {
            const left = Math.round(shape.left.left * scale);
            const right = Math.round(shape.right.right * scale);
            const top = Math.round(shape.left.top * scale);
            const bottom = Math.round(shape.right.bottom * scale);

            if (x >= left && x <= right && y >= top && y <= bottom) {
                return !!(card = this.cards[i]);
            }
        });

        return card;
    }

    /**
     * Returns true if model contains max allowed number of cards,
     * false otherwise
     *
     * @returns {boolean}
     */
    isFull() {
        return this.length >=
            this.options.MAX_GRID_COLS * this.options.MAX_GRID_ROWS;
    }
}

function sliceCards(args) {
    let cards = [];

    Array.prototype.slice.call(args, 0).forEach((cardsArg) => {
        if (!(cardsArg instanceof Array)) {
            cardsArg = [cardsArg];
        }

        cards = cards.concat(cardsArg);
    });

    return cards;
}

angular.module('toys').service('Cards', [
    'MEMORY_CARDS_OPTIONS',
    'activityModel',
    'firebaseAppModel',
    '$timeout',
    'guidService',
    Cards
]);
