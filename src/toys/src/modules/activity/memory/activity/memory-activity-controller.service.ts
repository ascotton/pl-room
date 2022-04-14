import { MemoryBaseController } from '../services/memory-base-controller.service';
import angular from 'angular';
import { debounce, propertyOf } from 'lodash';

class MemoryController extends MemoryBaseController {
    // isMac: RegExpMatchArray;
    initialized = false;
    bodyOffset: any = {};
    mousePosition = {
        x: 0,
        y: 0,
    };
    hotkeysConfig: any;
    presentationMode: boolean;
    markerStyle: any = {};
    cardsServiceWillingToChangeVisibility = [];
    xRay = false;
    lastInsertPos: any;
    lastHighlightCard: any;
    focused: boolean;
    lastHoverCard: any;
    dropConfig: any;
    turnsLeft: number = 999;

    /**
     * @constructor
     * @param {Object} $scope
     * @param {Cards} cards
     * @param {Object} currentUserModel
     * @param {ActivityModel} activityModel
     * @param {LocalStorageService} localStorage
     * @param {Object} options
     * @param {Function} $timeout
     * @param {hotkeys} hotkeys
     */
    constructor(
        private $scope,
        private cards,
        currentUserModel,
        activityModel,
        localStorage,
        options,
        private $timeout,
        $window,
        private hotkeys,
    ) {
        super(activityModel, localStorage, currentUserModel, options);

        $scope.memoryController = this;

        // this.isMac = navigator.platform.match(/^mac/i);

        this.$scope = $scope;
        this.$scope.isFirefox = ~window.navigator.userAgent.indexOf('Firefox');

        this.hotkeysConfig = [{
            combo: 'del',
            action: 'keyup',
            callback: this.clearHighlightedIfClinician.bind(this),
        }, {
            combo: 'backspace',
            action: 'keyup',
            callback: this.clearHighlightedIfClinician.bind(this),
        }, {
            combo: 'del',
            action: 'keydown',
            description: 'Delete selected Cards',
            callback: this.deleteSelectedCards.bind(this),
        }, {
            combo: 'backspace',
            action: 'keydown',
            description: 'Delete selected Cards',
            callback: this.deleteSelectedCards.bind(this),
        }, {
            combo: 'alt',
            action: 'keydown',
            description: 'Select cards',
            callback: this.selectCards.bind(this),
        }];

        const win = $($window);
        const asyncResize = debounce(() => {
            this.bodyOffset = $('.memorycard-board').offset();
            $scope.$evalAsync();
        },                             100);
        win.on('resize', asyncResize);

        $scope.$on('$destroy', () => {
            this.cards.cleanModel();
            this.removeGlobalEvents();
            win.off('resize', asyncResize);
        });

        const animateUnmatched = (indices) => {
            (indices || []).forEach((index) => {
                const domCard = $($('.memorycard-board div.card').get(index));

                domCard.addClass('ripple-in-fail');

                this.$timeout(() => domCard.removeClass('ripple-in-fail'), 1000);
            });
        };

        const animateMatched = (indices) => {
            (indices || []).forEach((index) => {
                const domCard = $($('.memorycard-board div.card').get(index));

                domCard.addClass('ripple-out');

                this.$timeout(() => domCard.removeClass('ripple-out'), 1000);
            });
        };

        const onDataUpdate = (newData, oldData) => {
            if (!(this.initialized || this.cards.players.length) && this.isClinician()) {
                $scope.$evalAsync(() => this.presentationMode = true);
                this.$timeout(() => this.presentationMode = false, 5000);
            }

            this.initialized = true;

            // This is how we prevent flickering on page load
            $('.memorycard-scale-wrapper').removeClass('hide');

            // animate unmatched
            if (newData.turnPaused &&
                newData.turnPaused !== oldData.turnPaused &&
                newData.unmatched && newData.unmatched.length
            ) {
                animateUnmatched(newData.unmatched);
            }

            // animate matched cards
            if (newData.matched && newData.matched !== oldData.matched) {
                // Added timeout due to PL-1994 to run match animation after flip animation
                this.$timeout(() => animateMatched(this.cards.getCardIndicesById(newData.matched)), 250);
            }

            // Fixed PL-1997
            $scope.$evalAsync();
        };

        this.cards.on('dataUpdate', onDataUpdate)
            .on('match', card => animateMatched((this.cards.getSimilar(card) || { indices: [] }).indices))
            .on('matchFail', ids => animateUnmatched(this.cards.unmatched));

        this.cards.updateData();

        this.isClinician = this.isClinician.bind(this);

        this.dragCard = this.dragCard.bind(this);
        this.dropCard = this.dropCard.bind(this);

        this.getCardStyle = this.getCardStyle.bind(this);
        this.getCardClass = this.getCardClass.bind(this);
        this.setFocusedTrue = this.setFocusedTrue.bind(this);
        this.setFocusedFalse = this.setFocusedFalse.bind(this);
        this.setMousePosAndSelectCards = this.setMousePosAndSelectCards.bind(this);

        try {
            this.xRay = this.localStorage.get(this.KEY_XRAY) === 'true';
        } catch (e) {
            console.debug('localStorage error in MemoryController');
        }

        this.initScale();
        this.initGlobalEvents();
    }

    /**
     * Initializes cross-frame communication channel event
     * listeners
     */
    initChannel() {
        return this.getChannel().then((channel: any) => {
            channel.bind('xRayChanged', (e, value) => {
                this.xRay = value;
                this.$scope.$evalAsync();
            });

            channel.bind('animateCards', () => {
                this.cards.animated = true;
                this.$scope.$evalAsync();
            });

            channel.bind('dragCardCancel', () => {
                this.lastInsertPos = null;
                this.markerStyle.display = 'none';
                this.cards.dehighlight();
                this.$scope.$evalAsync();
            });
        });
    }

    flipsStatusMessage() {
        if (!this.cards.maxFlipsPerTurn) {
            this.turnsLeft = 999;
            return 'unlimited flips';
        }

        this.turnsLeft = this.cards.maxFlipsPerTurn - this.cards.turnFlips;

        return (this.turnsLeft) + ' flips left';
    }

    /**
     * Highlights all similar cards to the card under x,y coordinates ath the deck
     *
     * @param {number} x
     * @param {number} y
     */
    highlightByXY(x, y) {
        const scale = this.$scope.scale;
        const card = this.cards.getCardByXY(x, y, scale);

        if (card && this.lastHighlightCard !== card) {
            const similar = this.cards.getSimilar(card);

            if (similar) {
                this.cards
                .dehighlight()
                .highlight(similar.indices);
            }

            this.lastHighlightCard = card;
            this.$scope.$evalAsync();
        } else if (!card) {
            this.clearHighlighted();
        }
    }

    /**
     * Marks all cards dehighlighted if there is highlighed any
     */
    clearHighlighted() {
        if (this.cards.hasHighlighted()) {
            this.cards.dehighlight();
            this.lastHighlightCard = null;
            this.$scope.$evalAsync();
        }
    }

    /**
     * Remove selected cards
     */
    deleteSelectedCards(e) {
        if (!this.isClinician()) {
            return;
        }
        this.cards.animated = false;
        this.cards.removeSelected().save();
        this.$scope.$evalAsync(() => this.reanimate());
        e.preventDefault();
    }

    /**
     * Select cards
     */
    selectCards(e) {
        if (!this.isClinician()) {
            return;
        }
        e.preventDefault();
        this.highlightByXY(this.mousePosition.x, this.mousePosition.y);
    }

    /**
     *  clear highlighted
     */
    clearHighlightedIfClinician() {
        if (!this.isClinician()) {
            return;
        }
        this.clearHighlighted();
    }

    /**
     * set focused true
     */
    setFocusedTrue() {
        this.focused = true;
    }

    /**
     * set focused false
     */
    setFocusedFalse() {
        this.focused = false;
    }

    /**
     * Set mouse position and select cards
     */
    setMousePosAndSelectCards(e) {
        if (!this.focused) {
            window.focus();
        }

        this.mousePosition.x = (e.pageX || e.clientX || e.x) - (propertyOf(this.bodyOffset)('left') | 0);
        this.mousePosition.y = (e.pageY || e.clientY || e.y) - (propertyOf(this.bodyOffset)('top') | 0);

        if (e.altKey && this.isClinician()) {
            e.preventDefault();
            this.highlightByXY(this.mousePosition.x, this.mousePosition.y);
        } else {
            this.clearHighlighted();
        }
    }

    /**
     * Initializes global frame events
     *
     * @access private
     */
    initGlobalEvents() {
        this.mousePosition.x = 0;
        this.mousePosition.y = 0;

        this.hotkeysConfig.forEach(item => this.hotkeys.add(item));

        $(window)
            .on('focus', this.setFocusedTrue)
            .on('blur', this.setFocusedFalse)
            .on('mousemove', this.setMousePosAndSelectCards);
    }

    removeGlobalEvents() {
        this.mousePosition.x = 0;
        this.mousePosition.y = 0;

        this.hotkeysConfig.forEach(item => this.hotkeys.del(item.combo));

        $(window)
            .off('focus', this.setFocusedTrue)
            .off('blur', this.setFocusedFalse)
            .off('mousemove', this.setMousePosAndSelectCards);
    }

    /**
     * Returns true if current deck mode set to x-ray, false otherwise
     *
     * @returns {boolean}
     */
    isXRay() {
        return this.isClinician() && this.xRay;
    }

    /**
     * Returns CSS classes defined for the cards container
     *
     * @returns {string}
     */
    getContainerClass() {
        let classes = 'main card-' + this.cards.cardType;

        if (this.isXRay()) {
            classes += ' card-xray';
        }

        if (this.cards.animated) {
            classes += ' animated';
        }

        return classes;
    }

    /**
     * Dynamically calculates and returns classes for the card
     * by it's index in the model collection
     *
     * @param {number} index
     * @returns {string}
     */
    getCardClass(index) {
        let returnValue = 'card';

        if (this.cards.isHighlighted(index)) {
            returnValue += ' dragover';
        }

        if (!this.cards.isVisible(index)) {
            returnValue += ' back';
        }

        if (this.cards.isSelected(index)) {
            returnValue += ' selected';
        }

        if (!this.cards.get(index).thumbnail_url) {
            returnValue += ' no-image';
        }

        return returnValue;
    }

    /**
     * Dynamically calculates and returns styles for the card with the given
     * index in a cards collection
     *
     * @param {number} index
     * @returns {{top: number, left: number, width: number, height: number}}
     */
    getCardStyle(index) {
        const dims = this.cards.getPosition(index);

        return {
            top: dims.top,
            left: dims.left,
            fontSize: dims.width,
        };
    }

    /**
     * Initializes scaling factor on controller init and
     * re-calculates it on window resize event
     *
     * @access private
     */
    initScale() {
        const html = $('html');
        const win = $(window);
        const body = $('.memorycard-board');
        let styleTag = null;

        this.bodyOffset = body.offset();

        const resizeHandler = () => {
            const ratio = this.options.BOARD_WIDTH /
                this.options.BOARD_HEIGHT;

            const realWidth = body.width();
            const realHeight = body.height();
            const realRatio = realWidth / realHeight;

            const scale = ratio > realRatio ?
            realWidth / this.options.BOARD_WIDTH :
            realHeight / this.options.BOARD_HEIGHT;

            this.$scope.scale = scale;
            this.bodyOffset = body.offset();

            html.find('.memorycard-scale-wrapper')
                .css('transform', `scale3d(${scale}, ${scale}, ${scale})`);

            if (this.$scope.isFirefox) {

                if (!styleTag) {
                    styleTag = $('<style type="text/css"></style>')
                        .appendTo('head');
                }

                const selectedScale = 3 / scale;
                const defaultScale = 1 / scale;
                styleTag.html(
                    `.memorycard-board .card {
                        border: 1px solid rgba(255, 255, 255, 0.01);
                        outline: 1px solid transparent;
                    }
                    .memorycard-board .card:before {
                        border: none !important;
                        background-size:
                            10px ${defaultScale}px,
                            10px ${defaultScale}px,
                            ${defaultScale}px 10px,
                            ${defaultScale}px 10px !important;
                        background-position: 0 0,  0 100%, 0 0, 100% 0 !important;
                        background-repeat: repeat-x,repeat-x,repeat-y,repeat-y !important;
                        background-image:
                        linear-gradient(to right, #979797 50%, #979797 50%),
                        linear-gradient(to right, #979797 50%, #979797 50%),
                        linear-gradient(to bottom, #979797 50%, #979797 50%),
                        linear-gradient(to bottom, #979797 50%, #979797 50%) !important
                    }
                    .memorycard-board .card.selected:before,
                    .memorycard-board .card.dragover:before {
                        'background-size:
                            '10px ${defaultScale}px,
                            '10px ${defaultScale}px,
                            ${selectedScale}px 10px,
                            ${selectedScale}px 10px !important;
                        'background-image:
                            'linear-gradient(to right, #46b1e1 50%, #46b1e1 50%),
                            'linear-gradient(to right, #46b1e1 50%, #46b1e1 50%),
                            'linear-gradient(to bottom, #46b1e1 50%, #46b1e1 50%),
                            'linear-gradient(to bottom, #46b1e1 50%, #46b1e1 50%) !important
                    }
                    .user-avatar .box {
                        'border: none !important;
                        'background-size:
                        '10px ${defaultScale}px,
                        '10px ${defaultScale}px,
                        ${defaultScale}px 10px,
                        ${defaultScale}px 10px !important;
                        'background-position: 0 0,  0 100%, 0 0, 100% 0 !important;
                        'background-repeat: repeat-x,repeat-x,repeat-y,repeat-y !important;
                    }

                    '.user-avatar.blue .box {
                        'background-image:
                        'linear-gradient(to right, #46b1e1 50%, #46b1e1 50%),
                        'linear-gradient(to right, #46b1e1 50%, #46b1e1 50%),
                        'linear-gradient(to bottom, #46b1e1 50%, #46b1e1 50%),
                        'linear-gradient(to bottom, #46b1e1 50%, #46b1e1 50%) !important
                    }
                    .user-avatar.pink .box {
                        'background-image:
                        'linear-gradient(to right, #b665a6 50%, #b665a6 50%),
                        'linear-gradient(to right, #b665a6 50%, #b665a6 50%),
                        'linear-gradient(to bottom, #b665a6 50%, #b665a6 50%),
                        'linear-gradient(to bottom, #b665a6 50%, #b665a6 50%) !important
                    }
                    .user-avatar.green .box {
                        'background-image:
                        'linear-gradient(to right, #78a240 50%, #78a240 50%),
                        'linear-gradient(to right, #78a240 50%, #78a240 50%),
                        'linear-gradient(to bottom, #78a240 50%, #78a240 50%),
                        'linear-gradient(to bottom, #78a240 50%, #78a240 50%) !important
                    }
                    .user-avatar.orange .box {
                        'background-image:
                        'linear-gradient(to right, #f26724 50%, #f26724 50%),
                        'linear-gradient(to right, #f26724 50%, #f26724 50%),
                        'linear-gradient(to bottom, #f26724 50%, #f26724 50%),
                        'linear-gradient(to bottom, #f26724 50%, #f26724 50%) !important
                    }`,
                );
            }

        };

        const halfDrawerWidth = this.options.DRAWER_WIDTH / 2;

        const handleDrawer = (drawer, _drawer) => {
            if (drawer === _drawer) {
                return;
            }

            this.bodyOffset.left += drawer !== 'null' ? -halfDrawerWidth : halfDrawerWidth;
        };

        this.$scope.$watch(() => body.width(), resizeHandler);
        this.$scope.$watch(() => sessionStorage.getItem('activeDrawer'), handleDrawer);

        resizeHandler();
    }

    /**
     * Card click handler
     *
     * @param {Event} $event
     * @param {number} $index
     */
    onCardClick($event, $index) {
        this.cards.animated = true;

        if ($event.altKey && this.isClinician()) {
            return this.toggleSelection($index);
        }

        this.cards.deselect();

        if (!this.cards.turnPaused) {
            this.toggleVisibility($index);
        }
    }

    /**
     * Toggles card selection state by its index
     *
     * @param {number} $index
     */
    toggleSelection($index) {
        const similar = this.cards.getSimilar($index);

        if (similar) {
            this.cards[this.cards.isSelected(similar.indices) ?
                'deselect' : 'select'](similar.indices);
        }
    }

    /**
     * Toggles card visibility by its index
     *
     * @param {number} $index
     */
    toggleVisibility ($index) {
        if (this.cards.isVisible($index)) {
            if (this.cards.isOpenedInCurrentTurn($index)) {
                this.cards
                    .setHidden($index, true)
                    .updateGameScores($index)
                    .save();
            }
        } else {
            this.cards
                .setVisible($index, true)
                .updateGameScores(true)
                .save();
        }
    }

    /**
     * Processes end of the turn of the cards game
     */
    endTurn() {
        if (this.cards.hasTurns()) {
            this.cards.endTurn().save();
        }
    }

    /**
     * Returns title for end turn button depending on the current game state
     *
     * @returns {string}
     */
    endTurnTitle() {
        return this.cards.length &&
            this.cards.players.length &&
            !this.cards.hasTurns() ?
                'Game Over' : 'End Turn';
    }

    /**
     * Returns score unit name for a given player
     *
     * @param {number} index - player index
     */
    getPlayerScore(index) {
        const score = this.cards.score[index] || 0;
        let similarsName = this.options.SIMILAR_NAMES[this.options.SIMILAR_LENGTH];

        similarsName = similarsName.charAt(0).toUpperCase() +
            similarsName.substr(1).toLowerCase();

        return `${score} ${score === 1 ? similarsName.replace(/s$/, '') : similarsName}`;
    }

    /**
     * Hadles card dragging event over the board
     *
     * @param {Event} e
     */
    dragCard(e) {
        const scale = this.$scope.scale || 1;
        const mouseX = (e.pageX || e.clientX || e.x) - (propertyOf(this.bodyOffset)('left') | 0);
        const mouseY = (e.pageY || e.clientY || e.y) - (propertyOf(this.bodyOffset)('top') | 0);
        const shapes = this.cards.getShapes();
        let pos = null;
        let type = 'insert';
        let insertIndex = -1;
        let cardIndex = -1;

        for (let i = 0, s = shapes.length; i < s; i++) {
            Object.keys(shapes[i]).some((area) => {
                let { top, left, bottom, right } = shapes[i][area];

                top *= scale;
                left *= scale;
                bottom *= scale;
                right *= scale;

                if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                    pos = {
                        left: shapes[i][area][area],
                        top: shapes[i][area].top,
                    };

                    type = area === 'main' ? 'replace' : 'insert';
                    cardIndex = i;
                    insertIndex = this.cards.cardsOrder.indexOf(i);

                    if (area === 'right') {
                        insertIndex++;
                    }

                    return true;
                }
            });

            if (pos) {
                break;
            }
        }

        if (!this.cards.length || this.cards.isFull() && (!pos || pos && type === 'insert')) {
            if (this.cards.hasHighlighted()) {
                this.lastHoverCard = null;
                this.cards.dehighlight();
                this.dropConfig = null;
                this.$scope.$evalAsync();
            }

            return;
        }

        if (!pos) {
            // insert by default at the end of cards
            cardIndex = shapes.length - 1;
            pos = (shapes[this.cards.cardsOrder[cardIndex]] || {}).right;

            if (pos) {
                pos = {
                    left: pos.right,
                    top: pos.top,
                };
            }

            type = 'insert';
            insertIndex = shapes.length;
        }

        switch (type) {
                case 'replace': {
                    this.lastInsertPos = null;
                    this.markerStyle.display = 'none';

                    if (this.lastHoverCard && this.lastHoverCard === this.cards.get(cardIndex)) {
                        return ;
                    }

                    const similar = this.cards.getSimilar(cardIndex);

                    if (similar) {
                        this.cards
                        .dehighlight()
                        .highlight(similar.indices);

                        this.dropConfig = {
                            type: 'replace',
                            cards: similar.indices,
                        };
                    }

                    this.lastHoverCard = this.cards.get(cardIndex);
                    this.$scope.$evalAsync();
                    break;
                }
                case 'insert': {
                    this.cards.dehighlight();
                    this.lastHoverCard = null;

                    if (this.lastInsertPos && this.lastInsertPos === pos) {
                        return;
                    }

                    this.dropConfig = {
                        type: 'insert',
                        cards: insertIndex,
                    };

                    this.markerStyle.display = 'block';

                    this.markerStyle.top = Math.round(pos.top + this.options.VERTICAL_PADDING / 2) + 'px';
                    this.markerStyle.left = Math.round(pos.left) + 'px';

                    this.markerStyle.height = (this.cards.cardType === 'both' ?
                        this.cards.grid.cellHeight :
                        this.cards.grid.cellWidth) + 'px';

                    this.lastInsertPos = pos;
                    this.$scope.$evalAsync();
                    break;
                }
        }
    }

    /**
     * Handles drop card event on a whiteboard
     *
     * @param {Event} e
     */
    dropCard(e) {
        this.cards.animated = false;
        this.markerStyle.display = 'none';
        this.cards.dehighlight();

        this.dropConfig = this.dropConfig || {};
        this.lastHoverCard = this.lastInsertPos = null;

        const type = this.dropConfig.type;
        const dropCardJson = e.dataTransfer.getData('memorycard');
        const cardsData = this.dropConfig.cards;
        const similar = Array(this.options.SIMILAR_LENGTH).fill(undefined)
            .map(() => JSON.parse(dropCardJson));

        this.getChannel().then((channel: any) => {
            channel.call({
                method: 'cardDropped',
                params: JSON.parse(dropCardJson),
            });
        });

        if (this.cards.isFull() && type !== 'replace') {
            return ; // deny adding more then allowed
        }

        switch (type) {
                case 'insert': {
                    this.cards.insert(similar, cardsData);
                    break;
                }
                case 'replace': {
                    this.cards.replace(cardsData, similar);
                    break;
                }
                default: { // simply add to the end
                    this.cards.add(similar);
                    break;
                }
        }

        this.cards.save();
        this.dropConfig = {};

        this.$scope.$evalAsync(() => this.reanimate());
    }

    /**
     * Re-animate cards
     */
    reanimate() {
        setTimeout(() => {
            this.cards.animated = true;
            this.cards.save();
        });
    }
}

const memoryController = angular.module('toys').controller('MemoryController', [
    '$scope',
    'Cards',
    'currentUserModel',
    'activityModel',
    'localStorageService',
    'MEMORY_CARDS_OPTIONS',
    '$timeout',
    '$window',
    'hotkeys',
    MemoryController,
]);
