import { propertyOf } from 'lodash';

import { PromisableEventEmitter } from './promisable-event-emitter';

/**
 * @class FlashCards
 * @classdesc Flash cards data service
 */
export default class FlashCards extends PromisableEventEmitter {

    private props: any;
    private initDigest: () => any;
    private activityLink: any;
    private stateLink: any;
    private onDataValueHandler: any;

    /**
     * Returns given card copy object
     *
     * @param {object} card
     * @returns {{
     *  type: string,
     *  url: string,
     *  title: string,
     *  x: number,
     *  y: number,
     *  angle: number,
     *  index: number,
     *  size: number
     * }}
     */
    static copy(card) {
        return {
            type: card.type || 'both',
            url: card.url,
            title: card.title,
            x: card.x || 0,
            y: card.y || 0,
            angle: card.angle || 0,
            index: card.index || 0,
            size: card.size || 0,
        };
    }

    /**
     * Returns copy of a given cards array
     *
     * @param {Array} cards
     * @returns {Array}
     */
    static copies(cards) {
        return JSON.parse(JSON.stringify(cards));
    }

    /**
     * @event FlashCards#settingsChange
     * @event FlashCards#cardsInit
     * @event FlashCards#beforeCardsChange
     * @event FlashCards#cardsChange
     */

    /**
     * Collection of cards currently attached to the cards board
     *
     * @property {Array} FlashCards#cards
     */
    get cards() {
        return this.props.cards;
    }
    set cards(cards) {
        cards = cards || [];

        // make sure we keep existing cards references
        const currentIds = this.props.cards.map(card => card.$id);
        const ids = cards.map(card => card.$id);

        currentIds.forEach((id, index) => {
            const i = ids.indexOf(id);

            if (~i) {
                // update with existing reference
                cards[i] = Object.assign(this.props.cards[index], cards[i]);
            }
        });

        // make sure we won't loose a reference to initial array
        // so first of all clear it
        this.props.cards.splice(0, this.cards.length);

        if (cards.length) {
            // and fill it with new values
            this.props.cards.push.apply(
                this.props.cards,
                cards,
            );
        }

        function compare(a, b) {
            if (a.title > b.title) {
                return 1;
            }
            if (a.title < b.title) {
                return -1;
            }
            return 0;
        }

        /**
         * Sorting required by
         * https://presencelearning.atlassian.net/browse/PL-1407
         */
        this.props.cards = this.props.cards.sort(compare);
    }

    /**
     * Cards display mode on a board. Could be either one of:
     * 'default'|'grid'|'bottom'|'presentation'|'collage'|'singlestack'
     *
     * @property {string} FlashCards#mode
     */
    get mode() {
        return this.props.mode;
    }
    set mode(mode) {
        if (!mode) {
            mode = 'default';
        }

        this.props.mode = mode;
    }

    /**
     * Boolean flag signaling if the cards should be visible on board or not
     *
     * @property {boolean} FlashCards#hide
     */
    get hide() {
        return this.props.hide;
    }
    set hide(hide) {
        this.props.hide = !!hide;
    }

    /**
     * Index of the card which is active in presentation mode
     *
     * @property {number} FlashCards#presentationActiveCard
     */
    get presentationActiveCard() {
        return this.props.presentationActiveCard;
    }
    set presentationActiveCard(index) {
        this.props.presentationActiveCard = index;
    }

    /**
     * Randomly selected number which defines
     * rotation angle calculation for the cards on a boards of
     * connected clients.
     *
     * @property {number} FlashCards#collageRandom
     */
    get collageRandom() {
        return this.props.collageRandom;
    }
    set collageRandom(rand) {
        this.props.collageRandom = rand;
    }

    /**
     * Boolean flag signaling if this data object has been
     * completely initialized or not
     *
     * @property {boolean} FlashCards##isInitialized
     * @readonly
     */
    get isInitialized() {
        return this.props.isInitialized;
    }
    set isInitialized(initialized) {
        throw new TypeError('trying to change read-only property "isInitialized"!');
    }

    /**
     * Boolean flag signaling if current action is handled by a local events outside
     * of this object (if set to true) or should be treated as normal
     * event, triggering all required event handlers
     *
     * @property {boolean} FlashCards#isLocalEvent
     */
    get isLocalEvent() {
        return this.props.isLocalEvent;
    }
    set isLocalEvent(isLocal) {
        this.props.isLocalEvent = isLocal;
    }

    /**
     * @constructor
     * @param {Function} $timeout
     */
    constructor(private $timeout) {
        super();

        /**
         * @access private
         * @property {Function} Cards#$timeout
         */
        this.initDigest = () => this.$timeout();
        this.$timeout = $timeout;

        this.cleanModel();
    }

    /**
     * Clears and resets the model state to initial
     */
    cleanModel() {
        if (this.activityLink) {
            this.activityLink.off('value', this.onDataValueHandler);
        }

        this.removeAllListeners('settingsChange');
        this.removeAllListeners('beforeCardsChange');
        this.removeAllListeners('cardsChange');
        this.removeAllListeners('cardsInit');

        /**
         * @access private
         * @property {{
         *  cards: Array,
         *  mode: string,
         *  hide: boolean,
         *  presentationActiveCard: number,
         *  collageRandom: number,
         *  isInitialized: boolean,
         *  isLocalEvent: boolean
         * }} FlashCards#$$props
         */
        this.props = Object.assign(this.defaultValue(), {
            isInitialized: false,
            isLocalEvent: false,
        });

        return this;
    }

    /**
     * Returns default initial data value object
     *
     * @returns {{
     *  cards: Array,
     *  mode: string,
     *  hide: boolean,
     *  presentationActiveCard: number,
     *  collageRandom: number
     * }}
     */
    defaultValue() {
        return {
            cards: [],
            state: {},
            mode: 'default',
            hide: false,
            presentationActiveCard: 0,
            collageRandom: 0,
        };
    }

    /**
     * Initializes firabase link
     *
     * @param {ActivityModel} activityModel
     * @param {FirebaseAppModel} fireBaseAppModel
     */
    initialize(activityModel, fireBaseAppModel) {
        const activeActivityId = propertyOf(fireBaseAppModel)('app.activeActivity.id');
        const activityModelId = propertyOf(activityModel)('activity.activityId');
        let queueId = propertyOf(fireBaseAppModel)('app.activeActivity.queueId');
        let activityId = propertyOf(fireBaseAppModel)('app.activeActivity.activityId');

        if (activityModelId !== activeActivityId) {
            queueId = 'STORE_ACTIVITY';
        }

        if (!activityId) {
            activityId = 'ACTIVITY_ID';
        }

        this.activityLink = activityModel
            .getRef('activities')
            .child('queues')
            .child('items')
            .child(queueId)
            .child('items')
            .child(activityId)
            .child('flashcards')
        ;

        this.stateLink = this.activityLink.child('state');

        this.onDataValueHandler = (data: any) => {
            const defaultValue = this.defaultValue();
            const value = data.val() || defaultValue;
            const cardsData = value ? value.state || {} : {};
            const cards = Object.keys(cardsData).map(
                id => Object.assign(cardsData[id], { $id: id }),
            );
            const isCardsChange = false;
            const oldSettings = FlashCards.copies(this.props);
            const oldCards = FlashCards.copies(this.cards);

            this.mode = value.mode || defaultValue.mode;
            this.hide = value.hide || defaultValue.hide;
            this.presentationActiveCard = value.presentationActiveCard || defaultValue.presentationActiveCard;
            this.collageRandom = value.collageRandom || defaultValue.collageRandom;

            this.emit('settingsChange', this, oldSettings).then(() => {
                const updateCards = () => { this.updateCardsEvent(cards, oldCards); };

                if (this.isLocalEvent) {
                    return updateCards();
                }

                this.emit('beforeCardsChange', (<any>cards), oldCards)
                    .then(updateCards)
                    .catch(updateCards);
            });

            this.initDigest();
        };

        this.activityLink.on('value', this.onDataValueHandler);
    }

    /**
     * @access private
     * @param {Array} cards
     * @param {Array} oldCards
     */
    updateCardsEvent(cards, oldCards) {
        this.cards = cards || [];

        if (this.isLocalEvent) {
            // local event was requested, job has done, so we
            // simply reset local event state
            this.isLocalEvent = false;
            this.ensureInit(undefined);
        } else {
            this.emit('cardsChange', cards, oldCards)
                .then(() => this.ensureInit(oldCards));
        }
    }

    /**
     * Ensures this cards object has been properly initialized and on the
     * initializiation triggers a proper cardsInit event
     *
     * @access private
     * @param {Array} oldCards
     */
    ensureInit(oldCards) {
        if (!this.isInitialized) {
            this.props.isInitialized = true;
            this.emit('cardsInit', this.cards, oldCards);
            return;
        }
        this.emit('cardsInitLocal', this.cards, oldCards);
    }

    /**
     * Updates current cards set with the new set of cards
     * and saves changes
     *
     * @param {Array} cards
     * @returns {FlashCards}
     */
    updateCards(cards) {
        cards = cards || this.cards;

        const data = {};

        for (let i = 0, s = cards.length; i < s; i++) {
            if (cards[i].$id !== undefined) {
                data[cards[i].$id] = FlashCards.copy(cards[i]);
            }
        }

        this.stateLink.update(data);

        return this;
    }

    /**
     * Removes given cards from the current cards set
     *
     * @param {Array} cards
     * @returns {FlashCards}
     */
    deleteCards(cards) {
        cards = cards || this.cards;

        const oldCards = FlashCards.copies(this.cards);
        const data = {};

        for (let i = 0, s = cards.length; i < s; i++) {
            data[cards[i].$id] = null;
        }

        this.stateLink.update(data);

        return this;
    }

    /**
     * Pushes new curd to a current card set and saves the changes
     *
     * @param {Object} card
     * @returns {String} new item key
     */
    createCard(card) {
        card = FlashCards.copy(card);
        this.cards.push(card);
        return this.stateLink.push(card).key;
    }

    /**
     * Adds new cards from a given set of cards to a current cards set
     * and saves changes
     *
     * @param {Array} cards
     * @returns {FlashCards}
     */
    createCards(cards) {
        cards = FlashCards.copies(cards);

        if (!this.isMock()) {
            this.activityLink.transaction((data) => {
                data = Object.assign(data || {}, {
                    mode: this.mode === 'default' ? 'grid' : this.mode,
                    hide: this.hide,
                    presentationActiveCard: this.presentationActiveCard,
                    collageRandom: this.collageRandom,
                    state: (data || {}).state || {},
                });

                for (let i = 0, s = cards.length; i < s; i++) {
                    const card = FlashCards.copy(cards[i]);

                    this.cards.push(card);
                    data.state[(`-Card${Date.now()}${i}`)] = card;
                }

                return data;
            });
        } else {
            for (let i = 0; i < cards.length; i++) {
                this.createCard(cards[i]);
            }
        }

        return this;
    }

    /**
     * Updates a card in a current set with the new card data
     *
     * @param {Object} card - card data
     * @returns {FlashCards}
     */
    updateCard(card) {
        this.stateLink
            .child(card.$id)
            .update(FlashCards.copy(card));

        return this;
    }

    deleteCard(card) {
        this.stateLink
            .child(card.$id)
            .remove();

        return this;
    }

    /**
     * Sets a new mode and saves changes
     *
     * @param {string} mode
     * @returns {FlashCards}
     */
    setMode(mode) {
        if (mode) {
            this.mode = mode;
            this.activityLink.update({
                mode,
            });
        }

        return this;
    }

    /**
     * Sets a new boolean value to hide cards flag and saves the changes
     *
     * @param {boolean} hide
     * @returns {FlashCards}
     */
    setHideCards(hide) {
        this.hide = hide;

        this.activityLink.update({
            hide: this.hide,
        });

        return this;
    }

    /**
     * Sets new presentation active card index and saves changes
     *
     * @param {number} index
     * @returns {FlashCards}
     */
    setPresentationActiveCard(index) {
        this.presentationActiveCard = index;

        this.activityLink.update({
            presentationActiveCard: index,
        });

        return this;
    }

    /**
     * Sets new collageRandom value and saves changes
     *
     * @param {*} collageRandom - nedw value
     * @param {Function} cb - success callback
     * @returns {FlashCards}
     */
    setCollageRandom(collageRandom, cb) {
        this.collageRandom = collageRandom;

        this.activityLink.update(
            {
                collageRandom,
            },
            cb);

        return this;
    }

    /**
     * Returns true if all firebase links are ready, false otherwise
     *
     * @returns {boolean}
     */
    isLinksReady() {
        return !!(this.activityLink && this.stateLink);
    }

    // Always false now since removed firebasemock.
    isMock() {
        return false;
    }

    /**
     * Cleans cards array
     *
     * @returns {FlashCards}
     */
    clean() {
        this.cards = [];
        this.initDigest();
        return this;
    }

}

import * as angular from 'angular';
angular.module('toys').service(
    'flashCards',
    ['$timeout', FlashCards],
);
