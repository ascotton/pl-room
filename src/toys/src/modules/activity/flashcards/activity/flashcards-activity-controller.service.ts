import { debounce, find, isFunction, isNumber } from 'lodash';
import angular from 'angular';

/**
 * @param {Object} $scope
 * @param {Function} $timeout
 * @param {Window} $window
 * @param {FlashCards} flashCards
 * @param {ActivityModel} activityModel
 * @param {Object} currentUserModel
 * @param {Object} options
 * @param {RoomClickService} RoomClickService
 * @param {hotkeys} hotkeys
 * @constructor
 */
function flashcardsController(
    $scope,
    $timeout,
    $window,
    flashCards,
    activityModel,
    fireBaseAppModel,
    currentUserModel,
    options,
    RoomClickService,
    hotkeys,
    iPadService,
) {
    const triggerRoomClickService = (method) => {
        RoomClickService.trigger('workspace', method);
    };
    const hotkeysConfig = {
        esc: 'Undo operation',
        left: 'Jump to previous card',
        right: 'Jump to next card',
        del: 'Delete selected card',
        backspace: 'Delete selected card',
    };

    const html = $('.flashcard-board');
    const body = $('body');

    $scope.showTitleDefault = 'title';

    let isFadableEvent = false;

    // Number of cards when animation should be replaced with fade-in/out
    // Any falseble value - disabled (0, false, null, undefined etc.)
    $scope.fadeOutAmount = 20;

    // Are we using firefox? This is used for border precision workaround.
    $scope.isFirefox = $window.navigator.userAgent.indexOf('Firefox') > -1;

    // The mode flashcards are in

    $scope.flashcardsMode = 'default';

    // Remember cards collection
    $scope.cards = flashCards.cards;

    // Dragging stuff
    $scope.dragoverNode = $('.flashcard-board .dragover');
    $scope.dragoverCard = null;

    // Flashcards board
    $scope.flashcardsBoard = $('.flashcard-board');

    // Lasso node
    $scope.lassoNode = $('.flashcard-board .lasso').get(0);

    // Selection is all here
    $scope.selectionNode = $('.flashcard-board .select').get(0);
    $scope.selectedNodes = [];
    $scope.selectedCards = [];

    $scope.lastLassoPosition = {};

    const checkPosition = (e) => {
        const rect = html.get(0).getBoundingClientRect();
        let clientX;
        let clientY;
        if (iPadService.isTouchEvent(e)) {
            clientX = iPadService.getClientXFromTouchEvent(e);
            clientY = iPadService.getClientYFromTouchEvent(e);
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const position = {
            x: (clientX - rect.left) / $scope.scale,
            y: (clientY - rect.top) / $scope.scale,
        };
        return position;
    };

    function isClinician() {
        return currentUserModel.user.isClinicianOrExternalProvider();
    }

    function shouldAnimate() {
        return !isFadableEvent ||
            ($scope.fadeOutAmount && $scope.cards.length < $scope.fadeOutAmount);
    }

    function clearAnimation() {
        $('.card').removeClass('.animated');
        $($scope.selectionNode).removeClass('.animated');
    }

    let fadeInTimeout = null;
    const lookupCard = (cards, id) => cards.filter(c => c.$id === id)[0] || undefined;

    function isTypeChanged(newCards, oldCards) {
        return newCards && oldCards &&
            newCards.length && oldCards.length &&
            newCards.some((card) => {
                const lookupResult = lookupCard(oldCards, card.$id);
                if (lookupResult &&  lookupResult.type !== card.type) {
                    return true;
                }
            });
    }

    function fadeOut(newCards, oldCards) {
        if (isTypeChanged(newCards, oldCards)) {
            isFadableEvent = true;
        }

        return new Promise((resolve) => {
            if (shouldAnimate()) {
                if ($scope.flashcardsBoard.hasClass('fade-off')) {
                    $scope.flashcardsBoard.removeClass('fade-off');
                }

                return resolve();
            }

            clearAnimation();

            $scope.flashcardsBoard.addClass('fast-fade-out');

            $timeout(() => {
                resolve();

                fadeInTimeout = $timeout(() => {
                    $scope.flashcardsBoard.removeClass('fast-fade-out');
                },                       250);
            },       250);
        });
    }

    function clearAnimated() {
        document.querySelectorAll('.card').forEach((ele) => {
            ele.classList.remove('animated');
        });
    }

    $scope.$on('flashcardsClearAnimated', () => {
        clearAnimated();
    });

    function animate(newCards, oldCards) {
        // For the new remove all cards (and in general) this animate functin
        // gets called pretty much all the time. So if you add cards and then
        // change anything (e.g. presentation mode, set title) that calls this
        // animate function, it would always add the `animated` class, which adds
        // a 1 second animation, which in turn causes a 1 second delay for the cards
        // on the screen to be removed. Even skipping this function if there are no
        // cards did not fix it. Calling clearAnimation did not work either.
        // Had to forcibly remove the animated class here..
        if (!newCards.length) {
            clearAnimated();
        } else {
            $scope.notifyDrawer();

            const needAnimation = shouldAnimate();

            isFadableEvent = false;

            clearAnimation();

            // remove deleted cards from selection array
            if ($scope.selectedCards && $scope.selectedCards.length) {
                for (let i = $scope.selectedCards.length; i > 0; i--) {
                    if (!~newCards.indexOf($scope.selectedCards[i])) {
                        $scope.selectedCards.splice(i, 1);
                        $scope.selectedNodes.splice(i, 1);
                    }
                }
            }

            if ($scope.presentationMode &&
                typeof $scope.nextCard !== 'number' &&
                $scope.recalcPresentationActiveCard
            ) {
                $scope.recalcPresentationActiveCard($scope.activeCard);
            }

            if (!needAnimation) {
                return $scope.$evalAsync();
            }
            $scope.dragoverNode.hide();

            for (let i = 0, s = $scope.cards.length; i < s; i++) {
                const newCard = $scope.cards[i];

                for (let j = 0, ss = oldCards.length; j < ss; j++) {
                    const oldCard = oldCards[j];

                    if (newCard.$id === oldCards[j].$id) {

                        // If specified card has changed and
                        // this change can be animated...
                        if (newCard.x !== oldCard.x ||
                            newCard.y !== oldCard.y ||
                            newCard.size !== oldCard.size ||
                            newCard.angle !== oldCard.angle ||
                            newCard.type !== oldCard.type
                        ) {
                            $('#card' + newCard.$id).addClass('animated');

                            // If updated card is selected, we also need to
                            // animate selection node.
                            if (~$scope.selectedCards.indexOf(newCard)) {
                                $($scope.selectionNode).addClass('animated');
                            }
                        }
                    }
                }
            }

            $scope.$evalAsync();
        }
    }

    flashCards.on('beforeCardsChange', (newCards, oldCards) => {
        if (flashCards.isInitialized && newCards && oldCards && newCards.length > oldCards.length) {
            $scope.flashcardsBoard.addClass('fade-off');

            return new Promise(resolve => resolve());
        }

        return fadeOut(newCards, oldCards);
    });

    flashCards.on('cardsChange', (newCards, oldCards) => {
        if (flashCards.isInitialized && newCards && oldCards && newCards.length > oldCards.length) {
            flashCards.isLocalEvent = true;

            if (flashCards.mode !== 'presentation') {
                $scope.setFlashcardsMode(flashCards.mode);
            } else {
                if (typeof $scope.activeCard !== 'number') {
                    $scope.setPresentationMode();
                } else {
                    placeActivePresentationCards();

                    for (let i = $scope.nextCard; i < newCards.length; i++) {
                        $scope.cards[i].index = $scope.cards.length - i;
                        placeSecondaryPresentationCard(i, $scope.nextCard);
                    }

                    flashCards.updateCards();
                }
            }
        }

        if ($scope.flashcardsBoard.hasClass('fade-off')) {
            return $scope.flashcardsBoard.removeClass('fade-off');
        }

        return animate(newCards, oldCards);
    });
    flashCards.on('cardsInit', () => {
        $scope.presentationMode = flashCards.mode === 'presentation';

        if ($scope.presentationMode) {
            $scope.activeCard = flashCards.presentationActiveCard;
            $scope.nextCard = $scope.activeCard + 1 >= $scope.cards.length ? undefined : $scope.activeCard + 1;
            $scope.prevCard = $scope.activeCard - 1 < 0 ? undefined : $scope.activeCard - 1;
        }

        $scope.notifyDrawer();
    });
    flashCards.on('cardsInitLocal', () => {
        $scope.presentationMode = flashCards.mode === 'presentation';
        $scope.notifyDrawer();

        if ($scope.flashcardsBoard.hasClass('fade-off')) {
            return $scope.flashcardsBoard.removeClass('fade-off');
        }
    });

    $scope.$on('$destroy', () => {
        angular.forEach(hotkeysConfig, (value, key) => hotkeys.del(key));
        flashCards.cleanModel();
    });

    $scope.initHotkey = (callback, type = 'esc') => {
        hotkeys.del(type);
        hotkeys.add({
            callback,
            combo: type,
            description: hotkeysConfig[type],
        });
    };

    $scope.delHotkey = (type = 'esc') => {
        hotkeys.del(type);
        hotkeys.add({
            combo: type,
            description: hotkeysConfig[type],
            callback: () => {},
        });
    };

    // This is used in cards watcher to inform drawer on collection change.
    // Considers special case when cards get updated before channel is ready.
    $scope.notifyDrawer = function() {
        const message = {
            method: 'flashcardsOnBoard',
            params: {
                cards: $scope.cards,
                isInitialized: flashCards.isInitialized,
            },
        };

        if (activityModel.channel) {
            activityModel.channel.call(message);
        } else {
            // Drawer communication channel is not yet ready,
            // so we use watcher.
            const cancelWatching = $scope.$watch(() => {
                return activityModel.channel;
            },                                   (channel) => {
                if (channel) {
                    cancelWatching();
                    channel.call(message);
                }
            });
        }

        return $scope;
    };

    $scope.getCardRect = function(card) {

        let cardRect = null;

        // Get card width / height
        const width = card.size;
        let height = card.size;

        // Special size for image/text cards
        if (card.type === 'both') {
            height = card.size * 250 / 212;
        }

        // Calculate rotation angle in radians
        let angle = Math.abs(card.angle);

        // Rotated cards
        if (angle !== 0) {

            // Prepare angles for sin/cos functions
            if ((angle > Math.PI * 0.5 && angle < Math.PI * 1) ||
                (angle > Math.PI * 1.5 && angle < Math.PI * 2)) {
                angle = Math.PI - angle;
            }

            const boxWidth = (Math.sin(angle) * height + Math.cos(angle) * width) / 2;
            const boxHeight = (Math.sin(angle) * width + Math.cos(angle) * height) / 2;

            cardRect = {
                left: card.x + width / 2 - boxWidth,
                top: card.y + height / 2 - boxHeight,
                right: card.x + width / 2 + boxWidth,
                bottom: card.y + height / 2 + boxHeight,
            };

        } else {

            // Non-rotated card rect
            cardRect = {
                left: card.x,
                top: card.y,
                right: card.x + width,
                bottom: card.y + height,
            };

        }

        return cardRect;

    };

    $scope.getCardApex = function(card) {

        const width = card.size;
        let height =  card.size;

        if (card.type === 'both') {
            height = card.size * 250 / 212;
        }

        const sinA = Math.sin(card.angle);
        const cosA = Math.cos(card.angle);

        const cX = card.x + width / 2;
        const cY = card.y + height / 2;

        const convertPoint = function(point) {

            // Rotate around card center
            const tempX = point.x - cX;
            const tempY = point.y - cY;

            // Apply rotation
            const rX = tempX * cosA - tempY * sinA;
            const rY = tempX * sinA + tempY * cosA;

            // Translate back
            return { x: rX + cX, y: rY + cY };
        };

        return [
            convertPoint({ x: card.x, y: card.y }),
            convertPoint({ x: card.x + width, y: card.y }),
            convertPoint({ x: card.x + width, y: card.y + height }),
            convertPoint({ x: card.x, y: card.y + height }),
        ];

    };

    $scope.getRectsIntersect = function(a, b) {

        // Based on Separating Axis Theorem

        const polygons = [a, b];
        let minA;
        let maxA;
        let projected;
        let i;
        let i1;
        let j;
        let minB;
        let maxB;

        for (i = 0; i < polygons.length; i++) {

            // For each polygon, look at each edge of the polygon,
            // and determine if it separates the two shapes.
            const polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {

                // Grab 2 vertices to create an edge.
                const i2 = (i1 + 1) % polygon.length;
                const p1 = polygon[i1];
                const p2 = polygon[i2];

                // Find the line perpendicular to this edge.
                const normal = { x: p2.y - p1.y, y: p1.x - p2.x };

                minA = maxA = undefined;
                // For each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values.
                for (j = 0; j < a.length; j++) {
                    projected = normal.x * a[j].x + normal.y * a[j].y;
                    if (angular.isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    if (angular.isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }

                // For each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values.
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b[j].x + normal.y * b[j].y;
                    if (angular.isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    if (angular.isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }

                // If there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap.
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }

        return true;

    };

    $scope.getSelectorRect = function(cards) {

        const mainRect = {
            left: screen.width,
            top: screen.height,
            right: 0,
            bottom: 0,
        };

        for (let i = 0; i < cards.length; i++) {

            // Here we could use getBoundingClientRect() for simplicity.
            // This approach will not work, since card nodes are not yet
            // placed at their new positions. We'll use circe equations.
            const cardRect = $scope.getCardRect(cards[i]);

            mainRect.left = Math.min(mainRect.left, cardRect.left);
            mainRect.top = Math.min(mainRect.top, cardRect.top);
            mainRect.right = Math.max(mainRect.right, cardRect.right);
            mainRect.bottom = Math.max(mainRect.bottom, cardRect.bottom);
        }

        return mainRect;

    };

    $scope.prepareRotateStyle = function (angle) {
        return angle
            ? `rotate(${angle}rad) translateZ(1px)`
            : '';
    };

    $scope.getCardClasses = function(card) {
        const selectedCards = $scope.selectedCards;
        const cardSelected =  selectedCards.indexOf(card) !== -1;
        const cardHideBorder = cardSelected && $scope.isFirefox &&
                               $scope.fireFoxMarchingAntsHack && selectedCards.length === 1;

        const classes = {
            'cards-presentation-cursor': $scope.presentationMode,
            'card-hide-border': cardHideBorder,
            'card-shadow': cardSelected,
            card: true,
        };
        classes['card-' + card.type] = true;
        return classes;
    };

    $scope.getCardStyle = function(card) {
        return {
            left: card.x + 'px',
            top: card.y + 'px',
            transform: $scope.prepareRotateStyle(card.angle),
            'z-index': card.index,
            'font-size': (card.size || '') + 'px',
        };
    };

    $scope.getSelectorStyle = function() {

        if ($scope.selectedCards.length > 1) {
            // For multiple selection we need to consider each
            // card's bounding rect and calculate minimal rect
            // that fits all cards.

            const rect = $scope.getSelectorRect($scope.selectedCards);

            return {
                left: (rect.left) + 'px',
                top: (rect.top) + 'px',
                width: (rect.right - rect.left) + 'px',
                height: (rect.bottom - rect.top) + 'px',
                'z-index': $scope.getMaxIndex(),
            };

        }

        if ($scope.selectedCards.length > 0) {
            // Single card selected
            return {
                left: ($scope.selectedCards[0].x) + 'px',
                top: ($scope.selectedCards[0].y) + 'px',
                'font-size': ($scope.selectedCards[0].size) + 'px',
                transform: $scope.prepareRotateStyle($scope.selectedCards[0].angle),
                'z-index': $scope.selectedCards[0].index,
            };
        }

        // Nothing's selected
        return {
            display: 'none',
        };
    };

    $scope.getSelectorClass = function() {
        if ($scope.selectedCards.length > 1) {
            // More than one card selected
            return 'multiselect dashed-border';
        }

        if ($scope.selectedCards.length > 0) {
            return 'card-' + $scope.selectedCards[0].type;
        }

        return '';
    };

    $scope.getMaxIndex = function() {

        // Calculates minimal z-index, which is
        // required to put current card on top of
        // others.

        const cards = $scope.cards;
        let maxIndex = 0;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].index > maxIndex) {
                maxIndex = cards[i].index;
            }
        }

        return maxIndex + 1;

    };

    $scope.selectCard = function(e, card) {
        const node = e.currentTarget;

        if ($(node).is('.card') && (iPadService.isTouchEvent(e) || e.button === 0)) {
            const index = $scope.getMaxIndex();

            card.index = index;

            if (!e.altKey) {
                $scope.selectedNodes.length = 0;
                $scope.selectedCards.length = 0;
            }

            $scope.selectedNodes.push(node);
            $scope.selectedCards.push(card);

            // We need to explicitly call show()
            // in order focus() to work. Then, we
            // remove animation.
            $($scope.selectionNode)
                // .show()
                // .focus()
                .removeClass('animated');
            // $log.info('selectCard::remove animated class from selection node', (new Date()).getTime());

            // Do not animate selected cards.
            $($scope.selectedNodes)
                .removeClass('animated');

            // Update selected card z-index.
            $(node).css({ 'z-index': index });

            // Focus window
            $window.focus();

            flashCards.updateCard(card);

        } else {
            $scope.selectedNodes.length = 0;
            $scope.selectedCards.length = 0;
            // $log.info('selectCard::selectedCards clear', (new Date()).getTime());

        }

        activityModel.channel.call({
            method: 'flashcardsSelected',
            params: $scope.selectedCards,
        });

        return !!e.preventDefault() || !!e.stopPropagation();
    };

    $scope.deleteCard = function(e) {

        // May need to check for OSX for backspace deletes
        if ($scope.selectedCards.length) {
            // Reset mode to default
            $scope.setDefaultMode();
        }

        // Update FireBase
        flashCards.deleteCards($scope.selectedCards);

        activityModel.channel.call({
            method: 'deselectCards',
        });

        if (e.preventDefault && e.stopPropagation) {
            return !!e.preventDefault() || !!e.stopPropagation();
        }

    };

    $scope.dragInit = function(card) {
        $scope.dragoverCard = card;

        if (!card) {
            $scope.dragoverNode.hide();
        }

        $scope.$evalAsync();
    };

    $scope.dragCard = function(e) {
        if (!flashCards.isInitialized || !$scope.dragoverCard) {
            return;
        }

        const position = checkPosition(e);
        $scope.dragoverNode.css({
            top: (position.y - (($scope.dragoverNode.outerHeight(true) / 2) | 0)) + 'px',
            left: (position.x - (($scope.dragoverNode.outerWidth(true) / 2) | 0)) + 'px',
            display: 'block',
        });

        return !!e.preventDefault() || !!e.stopPropagation();
    };

    $scope.dropCardQA = function dropCardQA(card) {
        if (!card) {
            throw new Error('Card should be passed to the function');
        }
        const dropCardEvent = function(droppedCard) {
            const me = this;
            this.clientX = html.height() / 2;
            this.clientY = html.width() / 2;
            this.preventDefault = function(){};
            this.stopPropagation = function(){};
            this.card = JSON.stringify(droppedCard);
            this.dataTransfer = {
                getData() {
                    return me.card;
                },
            };
        };

        $scope.dropCard(new dropCardEvent(card));
    };

    $scope.dropCard = function(dropEvent) {

        const json = dropEvent.dataTransfer.getData('flashcard');

        if (json) {
            triggerRoomClickService('dragEnd');

            // Stop previous animation
            $($scope.selectionNode)
                .removeClass('animated');

            $($scope.selectedNodes)
                .removeClass('animated');

            $scope.selectCard(dropEvent, null);

            const data = JSON.parse(json);
            const position = checkPosition(dropEvent);
            data.x = parseFloat((position.x - ($scope.dragoverNode.outerWidth(true) / 2) | 0).toFixed(3));
            data.y = parseFloat((position.y - ($scope.dragoverNode.outerHeight(true) / 2) | 0).toFixed(3));
            data.size = 212;
            data.angle = 0;
            data.index = $scope.getMaxIndex();

            if ($scope.presentationMode) {
                data.index = 1;
            } else {
                // Reset mode to default
                $scope.setDefaultMode();
            }

            const oldCardsAmount = $scope.cards.length;

            data.type = $scope.showTitleDefault ? checkRealCardType(data) : 'image';

            const newId = flashCards.createCard(data);

            // do not select card if presentation mode is ON
            if ($scope.presentationMode) {
                // Stop dragover
                $scope.dragoverCard = null;
                $scope.dragoverNode.hide();

                const unwatch = $scope.$watch(
                    () => {
                        return $scope.cards.length;
                    },
                    (newLength) => {
                        $timeout(() => {
                            if (!isNumber($scope.activeCard)) {
                                $scope.setPresentationMode();
                                return;
                            }
                            const newCardNum = newLength - 1;
                            let placeUnder = -1;
                            if ($scope.nextCard && $scope.nextCard !== newCardNum) {
                                placeUnder = $scope.nextCard;
                            }
                            placeSecondaryPresentationCard(newCardNum, placeUnder);
                            if (!isNumber($scope.nextCard)) {
                                $scope.nextCard = newCardNum;
                            } else {
                                for (let i = $scope.nextCard; i < $scope.cards.length; i++) {
                                    $scope.cards[i].index = $scope.cards.length - i;
                                }
                            }
                            flashCards.updateCards();
                        });
                        unwatch();
                    },
                    true,
                );

                return !!dropEvent.preventDefault() || !!dropEvent.stopPropagation();
            }

            // Automatically select dropped cards
            const unwatch = $scope.$watch(
                () => {
                    return $scope.cards.length;
                },
                (length) => {

                    if (!length || length === oldCardsAmount) {
                        return;
                    }

                    // We want to execute after digest has finished (and therefore node has been added)
                    // TODO: May rework this, since now we bind selection tool to card model
                    $timeout(() => {
                        const selectedCard = $scope.cards.filter((card) => {
                            return card.$id === newId;
                        }).pop();

                        if (!selectedCard) {
                            return;
                        }

                        const selectedNode = $('#card' + selectedCard.$id).get(0);

                        const event = {
                            currentTarget: selectedNode,
                            button: 0,
                            preventDefault: () => {},
                            stopPropagation: () => {},
                        };

                        // Stop dragover
                        $scope.dragoverCard = null;
                        $scope.dragoverNode.hide();

                        // Select card
                        $scope.selectCard(event, selectedCard);

                    });

                    // Remove watcher
                    unwatch();
                },
            );
        }

        return !!dropEvent.preventDefault() || !!dropEvent.stopPropagation();
    };

    $scope.addCardsOnWhiteboard = function(cards) {
        if (!cards || !cards.length || !flashCards.isLinksReady()) {
            return;
        }

        const ratio = 250 / 212;
        const cardSize = 212;
        const x = (1024 - 212) / 2;
        const y = (768 - (cardSize * ratio)) / 2;

        cards = angular.copy(cards);

        for (let i = 0, s = cards.length, card; i < s; i++) {
            card = cards[i];
            card.x = x;
            card.y = y;
            card.size = cardSize;
            card.angle = 0;
            card.index = $scope.getMaxIndex() + i;
            card.type = $scope.showTitleDefault ? checkRealCardType(card) : 'image';
        }

        flashCards.isLocalEvent = true;
        flashCards.createCards(cards);

        $scope.$evalAsync(() => {
            if (!$scope.presentationMode) {
                if ($scope.flashcardsMode === 'default' || !$scope.flashcardsMode) {
                    $scope.flashcardsMode = 'grid';
                    flashCards.setMode($scope.flashcardsMode);
                }

                $scope.setFlashcardsMode($scope.flashcardsMode, true);
            } else if ($scope.presentationMode) {
                if (typeof $scope.activeCard !== 'number') {
                    return $scope.setPresentationMode();
                }

                placeActivePresentationCards();

                for (let i = $scope.nextCard; i < $scope.cards.length; i++) {
                    $scope.cards[i].index = $scope.cards.length - i;
                    placeSecondaryPresentationCard(i, $scope.nextCard);
                }
            }

            flashCards.isLocalEvent = true;
            flashCards.updateCards();
        });
    };

    $scope.startMove = function(mouseEvent, card) {
        // startMove is the callback when a flashcard is clicked on.
        // We must blur the current active element, otherwise the flashcards activity will not get keyboard
        // events, in particular the 'delete' key. it's unclear why this component doesn't simply get focus
        // when clicked on, so for now resort to this manual blur.
        (<any>document.activeElement).blur();

        // Only react to left mouse button or touch event
        if (iPadService.isTouchEvent(mouseEvent) || mouseEvent.button === 0) {
            triggerRoomClickService('dragStart');
            const position = checkPosition(mouseEvent);
            const oX = position.x;
            const oY = position.y;

            // Click on a card should select card, while click
            // on selection tool doesn't affect selection.
            if ($(mouseEvent.currentTarget).is('.card')) {
                $scope.selectCard(mouseEvent, card);
            }

            // Create jQuery sets for convenience
            const selectionNode = $($scope.selectionNode);
            const selectedNodes = $($scope.selectedNodes);
            const selectedCards = $scope.selectedCards;

            // Prevent animation
            selectionNode.removeClass('animated');
            selectedNodes.removeClass('animated');

            // Remember selection position. Here we need
            // to request getSelectorStyle() directly, since
            // reading node's css doesn't yet contain valid
            // information (updated by digest).
            const sp = $scope.getSelectorStyle();
            const sX = parseFloat(sp.left) || 0;
            const sY = parseFloat(sp.top) || 0;
            const escHotkey = null;

            // Current cursor position
            let bX = null;
            let bY = null;

            const updateNodes = function() {
                // Move selection node
                selectionNode.css({
                    left: (sX + bX - oX).toFixed(3)  + 'px',
                    top: (sY + bY - oY).toFixed(3) + 'px',
                });

                // Move card nodes
                for (let i = 0; i < selectedNodes.length; i++) {
                    if (!selectedCards[i]) {
                        continue ;
                    }

                    $(selectedNodes[i]).css({
                        left: (selectedCards[i].x + bX - oX).toFixed(3)  + 'px',
                        top: (selectedCards[i].y + bY - oY).toFixed(3)  + 'px',
                    });
                }

            };

            const startMouseMove = function(evt) {

                // Reset mode to default
                $scope.setDefaultMode();

                const movePosition = checkPosition(evt);
                bX = movePosition.x;
                bY = movePosition.y;

                updateNodes();

                return !!evt.preventDefault() || !!evt.stopPropagation();

            };

            const stopMouseMove = function(evt, noSync) {
                if (bX !== null || bY !== null) {

                    if (!noSync) {

                        // Update cards
                        for (let i = 0; i < selectedCards.length; i++) {
                            selectedCards[i].x = parseFloat((selectedCards[i].x + bX - oX).toFixed(3));
                            selectedCards[i].y = parseFloat((selectedCards[i].y + bY - oY).toFixed(3));
                        }

                        flashCards.updateCards($scope.selectedCards);
                    }

                }

                html.off('mousemove', startMouseMove);
                html.off('touchmove', startMouseMove);
                html.off('mouseup', stopMouseMove);
                html.off('touchend', stopMouseMove);
                html.off('mouseleave', stopMouseMove);
                $scope.delHotkey();
                triggerRoomClickService('dragEnd');

                return !!evt.preventDefault() || !!evt.stopPropagation();

            };

            const cancelMove = function(evt) {
                triggerRoomClickService('dragEnd');
                bX = oX;
                bY = oY;
                updateNodes();
                return stopMouseMove(evt, true);
            };

            html.on('mousemove', startMouseMove);
            html.on('touchmove', startMouseMove);
            html.on('mouseup', stopMouseMove);
            html.on('touchend', stopMouseMove);
            html.on('mouseleave', stopMouseMove);

            $scope.initHotkey(cancelMove);
        }

        return !!mouseEvent.preventDefault() || !!mouseEvent.stopPropagation();
    };

    $scope.startRotate = function(rotateEvent, card) {
        // Only react to left mouse button or touch event
        if (iPadService.isTouchEvent(rotateEvent) || rotateEvent.button === 0) {
            triggerRoomClickService('dragStart');

            const handle = $(rotateEvent.currentTarget);

            // Highlight handle
            handle.addClass('active');

            // Set pointer cursor
            body.addClass('cursor-rotate');

            // Create jQuery sets for convenience
            const selectionNode = $($scope.selectionNode);
            const selectedNodes = $($scope.selectedNodes);

            // Prevent animation
            selectionNode.removeClass('animated');
            selectedNodes.removeClass('animated');

            // Please note that using selectedNodes.offset() will
            // consider rotation angle. This is why we use css().

            const offset = selectedNodes.css(['left', 'top']);
            const width = selectedNodes.outerWidth(true);
            const height = selectedNodes.outerHeight(true);
            let angle = null;

            const aX = parseInt(offset.left, 10) + width / 2;
            const aY = parseInt(offset.top, 10) + height / 2;

            const updateNodes = function() {
                const rotate = $scope.prepareRotateStyle(angle);
                selectedNodes.css({ transform: rotate });
                selectionNode.css({ transform: rotate });
            };

            const startRotate = function (evt) {
                // Reset mode to default
                $scope.setDefaultMode();
                const position = checkPosition(evt);
                const bX = position.x;
                const bY = position.y;

                angle = Math.atan2(bY - aY, bX - aX) + Math.PI * 0.5;

                const bias = 0.06666666666666666666; // = 3.0 / 45.0; // 3 degrees snapped once per 45 degrees
                const quarter = Math.PI / 4;
                const quarters = angle / quarter;

                const quartersRound = Math.round(quarters);
                if (quartersRound - bias < quarters && quarters < quartersRound + bias) {
                    angle = quartersRound * quarter;
                }

                updateNodes();

                return !!rotateEvent.preventDefault() || !!rotateEvent.stopPropagation();
            };

            const stopRotate = function(evt, noSync) {
                if (angle !== null) {
                    updateNodes();

                    if (!noSync) {

                        $scope.selectedCards[0].angle = angle;

                        flashCards.updateCard($scope.selectedCards[0]);

                    }
                }

                // Restore cursor
                body.removeClass('cursor-rotate');

                // Remove highlight
                handle.removeClass('active');

                html.off('mousemove', startRotate);
                html.off('mouseup', stopRotate);
                html.off('touchmove', startRotate);
                html.off('touchend', stopRotate);
                html.off('mouseleave', stopRotate);
                $scope.delHotkey();
                triggerRoomClickService('dragStop');

                return !!evt.preventDefault() || !!evt.stopPropagation();

            };

            const cancelRotate = function(evt) {

                if (evt.which === 27) {
                    angle = $scope.selectedCards[0].angle;

                    stopRotate(evt, true);

                    return false;
                }

            };

            html.on('mousemove', startRotate);
            html.on('mouseup', stopRotate);
            html.on('mouseleave', stopRotate);
            html.on('touchmove', startRotate);
            html.on('touchend', stopRotate);
            $scope.initHotkey(cancelRotate);
        }

        return !!rotateEvent.preventDefault() || !!rotateEvent.stopPropagation();

    };

    $scope.startResize = function(resizeEvent, card, type) {
        // Only react to left mouse button or touch event
        if (iPadService.isTouchEvent(resizeEvent) || resizeEvent.button === 0) {
            triggerRoomClickService('dragStart');

            const handle = $(resizeEvent.currentTarget);

            // Highlight handle
            handle.addClass('active');

            // Set pointer cursor
            html.addClass('cursor-pointer');

            // Create jQuery sets for convenience
            const selectionNode = $($scope.selectionNode);
            const selectedNodes = $($scope.selectedNodes);
            const selectedCards = $scope.selectedCards;

            // Prevent animation
            selectionNode.removeClass('animated');
            selectedNodes.removeClass('animated');

            // Please note that using selectedNodes.offset() will
            // consider rotation angle. This is why we use css().

            // Remember selection position and size
            const rect = selectionNode.css(['left', 'top']);
            const left = parseInt(rect.left, 10);
            const top = parseInt(rect.top, 10);
            const width = selectionNode.outerWidth(true);
            const height = selectionNode.outerHeight(true);

            // Find smallest card size
            let smallestCardSize = screen.width * 10;
            for (let i = 0; i < selectedCards.length; i++) {
                smallestCardSize = Math.min(smallestCardSize, selectedCards[i].size);
            }

            // Calculate selection width constraint
            const minCardWidth = parseInt($(selectedNodes[0]).css('min-width'), 10);
            const minSelectionWidth = width * minCardWidth / smallestCardSize;

            // Remember selection aspect ratio
            const hypo = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            const sinA = width / hypo;
            const cosA = height / hypo;

            // Selection center coordinates
            const aX = left + width / 2;
            const aY = top + height / 2;

            // We utilize getBoundingClientRect() to get handle center.
            // This considers handle rotation perfectly.
            // MAY NEED TO use math for better accuracy.
            const position = checkPosition(resizeEvent);
            const bX = position.x;
            const bY = position.y;

            // Normal vector and diagonal straight equation
            const vX = bX - aX;
            const vY = bY - aY;
            const A1 = vY;
            const B1 = -vX;
            const C1 = vX * aY - vY * aX;

            let resizeRatio = null;
            let newHypo = null;
            let newWidth = null;
            let newHeight = null;
            let newLeft = null;
            let newTop = null;
            let newSize = null;

            const updateNodes = function() {
                // New temporary cards configuration, which
                // is used to calculate selection rect.
                const tempCards = [];

                // Populate new cards config
                for (let j = 0; j < selectedCards.length; j++) {

                    const tempCard = {
                        x: Math.round(aX + resizeRatio * (selectedCards[j].x - aX)),
                        y: Math.round(aY + resizeRatio * (selectedCards[j].y - aY)),
                        size: resizeRatio * selectedCards[j].size,
                        angle: selectedCards[j].angle,
                        type: selectedCards[j].type,
                    };

                    tempCards.push(tempCard);

                    $(selectedNodes[j]).css({
                        left: tempCard.x + 'px',
                        top: tempCard.y + 'px',
                        'font-size': tempCard.size + 'px',
                    });
                }

                // Get selection rect
                const tempRect = $scope.getSelectorRect(tempCards);

                // Update selection size
                if (selectedNodes.length > 1) {
                    selectionNode.css({
                        width: (tempRect.right - tempRect.left) + 'px',
                        height: (tempRect.bottom - tempRect.top) + 'px',
                        left: (tempRect.left) + 'px',
                        top: (tempRect.top) + 'px',
                        'font-size': null,
                    });
                } else if (selectedNodes.length > 0) {
                    selectionNode.css({
                        width: null,
                        height: null,
                        left: Math.round(aX + resizeRatio * (selectedCards[0].x - aX)) + 'px',
                        top: Math.round(aY + resizeRatio * (selectedCards[0].y - aY)) + 'px',
                        'font-size': resizeRatio * selectedCards[0].size + 'px',
                    });
                }
            };

            const startResize = function (evt) {
                // Reset mode to default
                $scope.setDefaultMode();

                const pesizePosition = checkPosition(evt);
                const cX = pesizePosition.x;
                const cY = pesizePosition.y;

                // Perpendicular vector and it's straight equation
                const pX = A1;
                const  pY = B1;
                const  A2 = pY;
                const  B2 = -pX;
                const  C2 = pX * cY - pY * cX;

                // Find two lines crossing point
                const x = (C1 * B2 / B1 - C2) / (A2 - A1 * B2 / B1);
                const  y = -1 * (C1 + A1 * x) / B1;

                newHypo = 2 * Math.sqrt(Math.pow(aX - x, 2) + Math.pow(aY - y, 2));

                // Enforce selection size constraints
                if (sinA * newHypo < minSelectionWidth) {
                    newHypo = minSelectionWidth / sinA;
                }

                // Calculate new selection position and size
                resizeRatio = newHypo / hypo;
                newWidth = sinA * newHypo;
                newHeight = cosA * newHypo;
                newLeft = aX - newWidth / 2;
                newTop = aY - newHeight / 2;
                newSize = newWidth;

                updateNodes();

                return !!evt.preventDefault() || !!evt.stopPropagation();

            };

            const stopResize = function (evt, noSync) {
                if (resizeRatio !== null) {

                    updateNodes();

                    if (!noSync) {
                        for (let i = 0; i < selectedCards.length; i++) {
                            $scope.selectedCards[i].x = Math.round(aX + resizeRatio * (selectedCards[i].x - aX));
                            $scope.selectedCards[i].y = Math.round(aY + resizeRatio * (selectedCards[i].y - aY));
                            $scope.selectedCards[i].size = resizeRatio * selectedCards[i].size;
                        }

                        flashCards.updateCards($scope.selectedCards);
                    }
                }

                // Restore cursor
                html.removeClass('cursor-pointer');

                // Remove highlight
                handle.removeClass('active');

                html.off('mousemove', startResize);
                html.off('mouseup', stopResize);
                html.off('touchmove', startResize);
                html.off('touchend', stopResize);
                html.off('mouseleave', stopResize);
                $scope.delHotkey();

                triggerRoomClickService('dragStop');

                return !!evt.preventDefault() || !!evt.stopPropagation();

            };

            const cancelResize = function(evt) {
                newHypo = hypo;
                resizeRatio = 1;
                newLeft = left;
                newTop = top;
                newSize = width;
                return stopResize(evt, true);
            };

            html.on('mousemove', startResize);
            html.on('mouseup', stopResize);
            html.on('touchmove', startResize);
            html.on('touchend', stopResize);
            html.on('mouseleave', stopResize);
            $scope.initHotkey(cancelResize);
        }

        return !!resizeEvent.preventDefault() || !!resizeEvent.stopPropagation();

    };

    $scope.startLasso = function(lassoEvent) {
        // startLasso is the callback when the activity space is clicked on.
        // We must blur the current active element, otherwise the flashcards activity will not get keyboard
        // events, in particular the 'delete' key. it's unclear why this component doesn't simply get focus
        // when clicked on, so for now resort to this manual blur.
        (<any>document.activeElement).blur();

        $window.focus();

        triggerRoomClickService('dragStart');

        // Only react to left mouse button or touch event
        if (iPadService.isTouchEvent(lassoEvent) || lassoEvent.button === 0) {

            const clearSelection = !lassoEvent.shiftKey;
            // For touch, the inner startLasso function is not called on just a tap,
            // so the lastLassoPosition is never set and thus is the old value.
            const lassoPosition = checkPosition(lassoEvent);
            $scope.lastLassoPosition = lassoPosition;

            const lassoNode = $($scope.lassoNode);

            const position = checkPosition(lassoEvent);
            const sX = position.x;
            const sY = position.y;

            lassoNode
                .attr('style', '');

            const maxIndex = $scope.getMaxIndex();

            const startLasso = function(evt) {
                const lassoPosition = checkPosition(evt);
                $scope.lastLassoPosition = lassoPosition;
                const bX = lassoPosition.x;
                const bY = lassoPosition.y;

                // Lasso selection node
                lassoNode.css({
                    left: Math.min(sX, bX) + 'px',
                    top: Math.min(sY, bY) + 'px',
                    width: (Math.abs(bX - sX)) + 'px',
                    height: (Math.abs(bY - sY)) + 'px',
                    display: 'block',
                    'z-index': maxIndex,
                });

                return !!evt.preventDefault() || !!evt.stopPropagation();

            };

            const stopLasso = function(evt, noSync) {
                triggerRoomClickService('dragEnd');

                let lassoPosition = checkPosition(evt);
                if (lassoPosition.x < 0) {
                    lassoPosition = $scope.lastLassoPosition;
                }
                const bX = lassoPosition.x;
                const bY = lassoPosition.y;

                lassoNode
                    .attr('style', 'display: none;');

                if (!noSync) {

                    // Deselect currently selected card(s).
                    if (clearSelection) {
                        $scope.selectedNodes.length = 0;
                        $scope.selectedCards.length = 0;
                        // this is preventing selection animation when it's not needed,
                        // but not remove the root cause of it
                        $($scope.selectionNode).removeClass('animated');
                    }

                    const selRect = {
                        left: Math.min(sX, bX) + 1,
                        top: Math.min(sY, bY) + 1,
                        right: Math.min(sX, bX) + Math.abs(bX - sX) - 1,
                        bottom: Math.min(sY, bY) + Math.abs(bY - sY) - 1,
                    };


                    const selApex = [
                        { x: selRect.left, y: selRect.top },
                        { x: selRect.right, y: selRect.top },
                        { x: selRect.right, y: selRect.bottom },
                        { x: selRect.left, y: selRect.bottom },
                    ];


                    // Find intersecting cards
                    for (let i = 0; i < $scope.cards.length; i++) {

                        const card = $scope.cards[i];
                        const cardApex = $scope.getCardApex(card);

                        if ($scope.getRectsIntersect(selApex, cardApex)) {

                            if ($scope.selectedCards.indexOf(card) === -1) {
                                $scope.selectedCards.push(card);
                                $scope.selectedNodes.push($('#card' + card.$id).get(0));
                            }

                        }

                    }

                    activityModel.channel.call({
                        method: 'flashcardsSelected',
                        params: $scope.selectedCards,
                    });

                }

                $timeout(() => {});

                html.off('mousemove', startLasso);
                html.off('mouseup', stopLasso);
                html.off('touchmove', startLasso);
                html.off('touchend', stopLasso);
                html.off('mouseleave', stopLasso);
                $scope.delHotkey();

                return !!evt.preventDefault() || !!evt.stopPropagation();

            };

            const cancelLasso = function(evt) {
                return stopLasso(evt, true);
            };

            html.on('mousemove', startLasso);
            html.on('mouseup', stopLasso);
            html.on('touchmove', startLasso);
            html.on('touchend', stopLasso);
            html.on('mouseleave', stopLasso);
            $scope.initHotkey(cancelLasso);

        }

        return !!lassoEvent.preventDefault() || !!lassoEvent.stopPropagation();

    };

    $window.addEventListener('hashchange', (e) => {
        // Listen to hashchange notifications from top window.
        // This is how we detect clicks on grey area.
        // Second part of this code is located in lightyear.
        if (/^\#greyClicked_\d+$/.test($window.location.hash)) {
            $scope.selectCard(e, null);
            $timeout(() => {});
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                               NON-REFACTORED CODE GOES BELOW                              //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // display none mode start
    $scope.isDisplayNone = function() {
        return $scope.hideCards === null || !!$scope.hideCards;
    };
    // display none mode end

    // default paddings for getCardsDimensions
    // default padding increment for multiple cards layers
    const windowPadding = 30;
    const paddingIncrement = 3;

    // card min width
    function getMinWidth() {
        return parseInt($('.card').css('min-width'), 10);
    }

    // card min height
    function getMinHeight() {
        return getMinWidth() * (250 / 212);
    }

    // generic row/col calculation function
    const biggestCol = options.GRID.MAX_COLS;
    const biggestRow = options.GRID.MAX_ROWS;

    function getRowCol(num) {
        let row = 0;
        let col = 0;
        let diff;

        do {
            col++;
            row = Math.ceil(num / col);
            diff = col - row;
        } while (diff !== 1 && diff !== 2);

        // custom positioning for better UX
        if (num < biggestCol * biggestRow) {
            if (num >= Math.pow(biggestRow, 2)) {
                col = biggestCol;
                row = 4;
            }

            if (num > col * row) {
                row = biggestRow;
            }
        }

        if (row > biggestRow) {
            row = biggestRow;
        }

        if (col > biggestCol) {
            col = biggestCol;
        }

        return { rows: row, cols: col };
    }

    // bottom grid row/col calculation function
    function getRowColBottom(n, containerWidth, containerHeight) {
        return {
            rows: Math.ceil(containerHeight / (getMinHeight() * 1.12)),
            cols: Math.floor(containerWidth / (getMinWidth() * 1.12)),
        };
    }

    // single stack row/col calculation function
    function getRowColSinglestack() {
        return {
            rows: 1,
            cols: 1,
        };
    }

    // single stack mode sift function
    const MAX_CARDS_IN_SINGLE_STACK = 15;
    const PADDING_INCREMENT_SINGLE_STACK = 3;
    function getSinglestackShift(id) {
        const diff = $scope.cards.length - MAX_CARDS_IN_SINGLE_STACK;
        let inStackPosition = 0 ;
        if (diff > 0) {
            inStackPosition = id < diff ? 0 : id - diff;
        } else {
            inStackPosition = id;
        }
        const padding = PADDING_INCREMENT_SINGLE_STACK * inStackPosition;
        return {
            left: padding,
            top: padding,
            zIndex: $scope.cards.length - id + 1,
        };
    }

    // collage mode shift function - moves card closer to window center, randomizes z-index
    // and angle
    function getCollageShift(id, top, left, dimensions) {
        const containerCenterX = dimensions.containerWidth / 2;
        const containerCenterY = dimensions.containerHeigth / 2;
        const row = Math.floor(id / dimensions.cols);
        const randomValue = $scope.collageRandom || Math.random();
        const num = (id + 2) | 0;

        const leftRandom = (randomValue * num) - ((randomValue * num) | 0);
        const topRandom = (randomValue * (num * 2)) - ((randomValue * (num * 2)) | 0);
        const plusMinusRandom = ((randomValue * (num * 10)) | 0) % 2 === 0 ? -1 : 1;
        const zIndexRandom = leftRandom * plusMinusRandom;

        return {
            left: (containerCenterX - left) * (leftRandom * (0.3 - 0.2) + 0.15),
            top: (containerCenterY - top) * (topRandom * (0.3 - 0.2) + 0.15),
            angle: randomValue * 0.15 * plusMinusRandom,
            zIndex: (100 * (dimensions.rows - row)) + Math.floor(zIndexRandom * dimensions.cols),
        };
    }

    // calculate cards dimensions
    function getCardsDimensions(cards, containerWidth, containerHeigth, rowColFunction) {
        const num = cards.length;
        const rowCol = rowColFunction(num, containerWidth, containerHeigth);

        let ratio = 1;
        const cols = rowCol.cols;
        const rows = rowCol.rows;
        const cardSquare = (containerWidth - windowPadding * 2) * (containerHeigth - windowPadding * 2) / (rows * cols);

        if (find(cards, { type: 'both' })) {
            ratio = 212 / 250;
        }

        let cardHeight = Math.sqrt(cardSquare / ratio);
        let cardWidth = cardHeight * ratio;

        if (cardHeight * rows >= containerHeigth) {
            cardHeight = (containerHeigth - windowPadding * 2) / rows;
            cardWidth = cardHeight * ratio;
        }

        if (cardWidth * cols >= containerWidth) {
            cardWidth = (containerWidth - windowPadding * 2) / cols;
            cardHeight = cardWidth / ratio;
        }

        const leftPadding = (containerWidth - cardWidth * (num < cols ? num : cols)) / 2;
        const topPadding = (containerHeigth - cardHeight * rows) / 2;

        return {
            containerWidth,
            containerHeigth,
            cardWidth,
            cardHeight,
            cols,
            rows,
            leftPadding,
            topPadding,
        };
    }

    // place cards depending on calculated dimensions applying shift (shift function) and z-index

    function rearrangeCards(cards, dimensions, shift, zIndex, additionalShift) {
        shift = shift || {};
        let leftShift = shift.left || 0;
        let topShift = shift.top || 0;
        let zIndexShift = shift.zIndex || undefined;
        additionalShift = additionalShift || function() { return {}; };

        let shiftFunctionResult: any = {};
        let additionalShiftResult: any = {};

        cards.forEach((card, id) => {
            let row = Math.floor(id / dimensions.cols);
            const currentInRow = (id - (row * dimensions.cols));
            let left = dimensions.leftPadding + dimensions.cardWidth * currentInRow;
            let top;

            if (row > dimensions.rows - 1) {
                row = dimensions.rows - 1;
            }

            left += dimensions.cardWidth * 0.05;

            top = (dimensions.topPadding + dimensions.cardHeight * row);

            if (isFunction(shift)) {
                shiftFunctionResult = shift(id, top, left, dimensions);
                leftShift = shiftFunctionResult.left;
                topShift = shiftFunctionResult.top;
                zIndexShift = shiftFunctionResult.zIndex;
            }

            additionalShiftResult = additionalShift(id, top, left, dimensions);

            card.x = leftShift + left + (additionalShiftResult.left || 0);
            card.y = topShift + top + (additionalShiftResult.top || 0);
            card.size = (dimensions.cardWidth * 0.9);
            card.angle = (shiftFunctionResult.angle ? shiftFunctionResult.angle : 0) +
                (additionalShiftResult.angle || 0);

            if (zIndex || zIndexShift !== undefined) {
                card.index = zIndex || zIndexShift;
            }
        });

    }

    function makeCalculationsAndSetPosition(outputConfigObject) {
        if (!$scope.cards.length) {
            return;
        }

        outputConfigObject = Object.assign({
            containerWidth: html.width() / $scope.scale,
            containerHeight: html.height() / $scope.scale,
            containerTopPadding: 0,
            containerLeftPadding: 0,
            rowColFunction: getRowCol,
            shiftFunction: null,
        },                                 outputConfigObject);

        const minWidth = getMinWidth();
        let dimensions = getCardsDimensions(
            $scope.cards,
            outputConfigObject.containerWidth,
            outputConfigObject.containerHeight,
            outputConfigObject.rowColFunction,
        );
        const fixedWidth = minWidth * 1.12;
        const fixedPerPage = Math.floor(outputConfigObject.containerWidth / fixedWidth);
        let i = 0;

        // if calculated card width less then minimum width
        // or we have number of cards bigger than max cards per page
        // recalculate new dimensions and place cards in second, third... layer
        if (minWidth && dimensions.cardWidth * 0.9 < minWidth || (
            outputConfigObject.isGridLike &&
            $scope.cards.length > biggestCol * biggestRow
        )) {
            let dimensionsCalcError = false;

            do {
                if (i > $scope.cards.length) {
                    dimensionsCalcError = true;
                    break;
                }

                i++;

                let localCards = $scope.cards.slice(0, -i);

                if (!localCards.length) {
                    localCards = $scope.cards.slice(0, fixedPerPage);
                }

                dimensions = getCardsDimensions(
                    localCards,
                    outputConfigObject.containerWidth,
                    outputConfigObject.containerHeight,
                    outputConfigObject.rowColFunction,
                );
            } while (dimensions.cardWidth * 0.9 < minWidth);

            const fullNum = $scope.cards.length;
            const maxPageSize = biggestCol * biggestRow;
            const pageDelta = fullNum - i;
            let perPage = pageDelta >  maxPageSize ? maxPageSize : pageDelta;
            let pages = Math.ceil(fullNum / perPage);
            let cards;

            if (dimensionsCalcError) {
                const fullCardsWidth = fixedPerPage > fullNum ? fixedWidth * fullNum : fixedWidth * fixedPerPage;

                perPage = fixedPerPage;
                pages = Math.ceil(fullNum / perPage);
                dimensions.cardWidth = fixedWidth;
                dimensions.leftPadding = (outputConfigObject.containerWidth - fullCardsWidth) / 2;
                dimensions.cols = fixedPerPage;
                dimensions.rows = pages;
            }

            for (i = 0; i < pages; i++) {
                cards = $scope.cards.slice(i * perPage, (i + 1) * perPage);

                const shift = {
                    top: outputConfigObject.containerTopPadding + i * paddingIncrement,
                    left: outputConfigObject.containerLeftPadding + i * paddingIncrement,
                };

                rearrangeCards(cards, dimensions, shift, i + 1, outputConfigObject.shiftFunction);
            }
        } else {
            rearrangeCards($scope.cards, dimensions, outputConfigObject.shiftFunction, undefined, undefined);
        }

        if (!outputConfigObject.dontSave) {
            flashCards.updateCards($scope.cards);
        }
    }

    // init functions for grid, bottom grid, single stack, collage mods

    $scope.setGridMode = function() {
        makeCalculationsAndSetPosition({
            isGridLike: true,
            dontSave: !isClinician(),
        });
    };

    $scope.setBottomMode = function() {
        const fullContainerHeight = (html.height() / $scope.scale) - 2 * windowPadding;
        let topPadding = fullContainerHeight * (3 / 4);

        if (fullContainerHeight - topPadding < getMinHeight()) {
            topPadding = fullContainerHeight - getMinHeight();
        }

        makeCalculationsAndSetPosition({
            containerHeight: fullContainerHeight / 4,
            containerTopPadding: topPadding,
            rowColFunction: getRowColBottom,
            dontSave: !isClinician(),
        });
    };

    $scope.setSinglestackMode = function() {
        makeCalculationsAndSetPosition({
            rowColFunction: getRowColSinglestack,
            shiftFunction: getSinglestackShift,
            dontSave: !isClinician(),
        });
    };

    $scope.setCollageMode = function() {
        makeCalculationsAndSetPosition({
            shiftFunction: getCollageShift,
            isGridLike: true,
            dontSave: !isClinician(),
        });
    };

    // presentation mode functions start

    $scope.activeCard = 0;
    $scope.nextCard = undefined;
    $scope.prevCard = undefined;

    function placeActivePresentationCards() {
        if (!($scope.cards && $scope.cards[$scope.activeCard])) {
            return ;
        }

        const containerWidth = 1024;
        const limitedContainerHeight = 560;
        const fullContainerHeight = 768;
        const minWidth = getMinWidth();
        let ratio = 1;

        if (find($scope.cards, { type: 'both' })) {
            ratio = 250 / 212;
        }

        $scope.cards[$scope.activeCard].size = (limitedContainerHeight - 2 * windowPadding) / ratio;
        $scope.cards[$scope.activeCard].x = (containerWidth - $scope.cards[$scope.activeCard].size) / 2;
        $scope.cards[$scope.activeCard].y = (fullContainerHeight - $scope.cards[$scope.activeCard].size * ratio) / 2;
        $scope.cards[$scope.activeCard].index = $scope.cards.length;

        if (isNumber($scope.prevCard)) {
            $scope.cards[$scope.prevCard].size = minWidth;
            $scope.cards[$scope.prevCard].x = $scope.cards[$scope.activeCard].x - minWidth - 20;
            $scope.cards[$scope.prevCard].y = (fullContainerHeight - minWidth * ratio) / 2;
            $scope.cards[$scope.prevCard].index = $scope.prevCard;
        }

        if (isNumber($scope.nextCard)) {
            $scope.cards[$scope.nextCard].size = minWidth;
            $scope.cards[$scope.nextCard].x = $scope.cards[$scope.activeCard].x +
                $scope.cards[$scope.activeCard].size + 20;
            $scope.cards[$scope.nextCard].y = (fullContainerHeight - minWidth * ratio) / 2;
            $scope.cards[$scope.nextCard].index = $scope.cards.length - $scope.nextCard + 1;
        }
    }

    function placeSecondaryPresentationCard(num, placeUnder) {
        if (!$scope.cards[num]) {
            return;
        }
        const secondaryWidth = getMinWidth();
        const fullContainerHeight = 768;
        let ratio = 1;
        let positionX;
        let positionY;

        if ($scope.cards[num].type === 'both') {
            ratio = 250 / 212;
        }

        if (!placeUnder) {
            if (num < $scope.activeCard) {
                placeUnder = $scope.prevCard;
                $scope.cards[num].index = num;
            } else {
                placeUnder = $scope.nextCard;
                $scope.cards[num].index = $scope.cards.length - num + 1;
            }
        }

        if (placeUnder && $scope.cards[placeUnder]) {
            positionX = $scope.cards[placeUnder].x;
            positionY = $scope.cards[placeUnder].y;
        } else {
            positionX = $scope.cards[$scope.activeCard].x + $scope.cards[$scope.activeCard].size + 20;
            positionY = (fullContainerHeight - secondaryWidth * ratio) / 2;
        }

        $scope.cards[num].size = secondaryWidth;
        $scope.cards[num].x = positionX;
        $scope.cards[num].y = positionY;

    }

    function placePresentationCards(initial) {
        placeActivePresentationCards();

        if (initial && $scope.cards.length > 1) {
            for (let i = 0, s = $scope.cards.length; i < s; i++) {
                if (!~[$scope.prevCard, $scope.activeCard, $scope.nextCard].indexOf(i)) {
                    placeSecondaryPresentationCard(i, undefined);
                }
            }
        }

        flashCards.updateCards($scope.cards);
    }

    $scope.clickPresentationCard = function(index) {
        if (!$scope.cards[index]) {
            return;
        }

        const oldCards = angular.copy($scope.cards);

        flashCards.isLocalEvent = true;
        isFadableEvent = false;

        fadeOut(undefined, undefined).then(() => {
            let direction = 0;

            if ($scope.activeCard < index) {
                direction = 1;
            }

            $scope.activeCard = index;

            const oldNextCard = $scope.nextCard;

            $scope.nextCard = $scope.activeCard + 1 >= $scope.cards.length ? undefined : $scope.activeCard + 1;

            const oldPrevCard = $scope.prevCard;

            $scope.prevCard = $scope.activeCard - 1 < 0 ? undefined : $scope.activeCard - 1;

            if (!direction && isNumber($scope.nextCard) && isNumber(oldNextCard)) {
                $scope.cards[$scope.nextCard].index = $scope.cards[oldNextCard].index + 1;
            }

            if (direction && isNumber($scope.prevCard) && isNumber(oldPrevCard)) {
                $scope.cards[$scope.prevCard].index = $scope.cards[oldPrevCard].index + 1;
            }

            flashCards.setPresentationActiveCard($scope.activeCard);

            placePresentationCards(undefined);

            animate($scope.cards, oldCards);
        });
    };

    $scope.recalcPresentationActiveCard = function(index) {
        $scope.activeCard = index;

        if (!isNumber($scope.activeCard)) {
            return;
        }

        if ($scope.cards.length - 1 > index) {
            $scope.nextCard = index + 1;
        } else {
            $scope.nextCard = null;
        }

        if (index > 0) {
            $scope.prevCard = index - 1;
        } else {
            $scope.prevCard = null;
        }

        placePresentationCards(true);
    };

    $scope.cardsPresentationInstructionHidden = false;

    function initPresentationCards(leavePreviousCards) {
        $scope.presentationMode = true;

        $scope.selectedNodes.length = 0;
        $scope.selectedCards.length = 0;

        if (!leavePreviousCards) {
            $scope.activeCard = 0;
            $scope.nextCard = undefined;
            $scope.prevCard = undefined;

            if ($scope.cards.length > 1) {
                $scope.nextCard = 1;
            }

            flashCards.setPresentationActiveCard($scope.activeCard);
        }

        $scope.initHotkey(nextPresentationCard, 'right');
        $scope.initHotkey(prevPresentationCard, 'left');
    }

    function nextPresentationCard(event) {
        if (!$scope.presentationMode || !isNumber($scope.nextCard)) {
            return true;
        }
        const temp = $scope.activeCard;
        $scope.activeCard = $scope.nextCard;
        flashCards.setPresentationActiveCard($scope.activeCard);
        if (isNumber($scope.prevCard)) {
            $scope.cards[temp].index = $scope.cards[$scope.prevCard].index + 1;
        }
        $scope.prevCard = temp;
        $scope.nextCard = $scope.activeCard + 1 >= $scope.cards.length ? undefined : $scope.activeCard + 1;
        placePresentationCards(undefined);
    }

    function prevPresentationCard(event) {
        if (!$scope.presentationMode || !isNumber($scope.prevCard)) {
            return true;
        }
        const temp = $scope.activeCard;
        $scope.activeCard = $scope.prevCard;
        flashCards.setPresentationActiveCard($scope.activeCard);
        if (isNumber($scope.nextCard)) {
            $scope.cards[temp].index = $scope.cards[$scope.nextCard].index + 1;
        }
        $scope.nextCard = temp;
        $scope.prevCard = $scope.activeCard - 1 < 0 ? undefined : $scope.activeCard - 1;
        placePresentationCards(undefined);
    }

    $scope.setPresentationMode = function(onlyInit, leavePreviousCards) {
        $scope.$evalAsync(() => {
            $scope.cardsPresentationInstructionHidden = false;
        });

        $timeout(() => {
            $scope.cardsPresentationInstructionHidden = true;
        },       2000);

        initPresentationCards(leavePreviousCards);

        if (onlyInit) {
            return;
        }

        $scope.cards.forEach(card => card.angle = 0);

        placePresentationCards(true);
    };

    // presentation mode functions end

    // default mode - no modes selected

    $scope.setDefaultMode = function() {
        if ($scope.flashcardsMode !== 'default') {
            $scope.flashcardsMode = 'default';
            flashCards.setMode($scope.flashcardsMode);
        }
    };

    // mode change handler with "modes->initialization funciton" mapping

    const modesMap = {
        grid: $scope.setGridMode,
        bottom: $scope.setBottomMode,
        presentation: $scope.setPresentationMode,
        collage: $scope.setCollageMode,
        singlestack: $scope.setSinglestackMode,
        default: $scope.setDefaultMode,
    };

    $scope.setFlashcardsMode = function(mode, force) {
        if (mode === $scope.flashcardsMode && !force) {
            return ;
        }

        isFadableEvent = mode !== 'default';

        let args = Array.prototype.slice.call(arguments, 1);

        if (!$scope.cards || !$scope.cards.length) {
            return;
        }

        $scope.presentationMode = false;

        // call mode initialization function if present
        let animatedCalled = false;
        if (isFunction(modesMap[mode])) {
            fadeOut(undefined, undefined).then(() => {
                const oldCards = angular.copy($scope.cards);

                $scope.flashcardsMode = mode;
                // If no args, set leave cards to true, otherwise when student joins, it will reset
                // active card to 0.
                if (mode === 'presentation') {
                    if (!args.length) {
                        args = [null, 1]
                    }
                }
                modesMap[mode].apply($scope, args);

                animate($scope.cards, oldCards);
                animatedCalled = true;
            });
        }

        if (!animatedCalled) {
            clearAnimated();
        }
    };

    function checkRealCardType(card) {
        if (card.title && card.url) {
            return 'both';
        }
        if (card.title) {
            return 'title';
        }
        if (card.url) {
            return 'image';
        }

        return 'both';
    }

    // Show title switcher
    $scope.setShowTitle = function(value) {
        $scope.showTitleDefault = value;
        flashCards.isLocalEvent = true;
        isFadableEvent = true;

        fadeOut(undefined, undefined).then(() => {
            let cards;
            let oldCards;

            if ($scope.selectedCards && $scope.selectedCards.length) {
                cards = $scope.selectedCards;
            } else {
                cards = $scope.cards;
            }

            oldCards = angular.copy(cards);

            cards.forEach((card) => {
                const realType = checkRealCardType(card);

                if (realType === 'title') {
                    return;
                }

                card.type = value ? realType : 'image';
            });

            if ($scope.flashcardsMode && $scope.flashcardsMode !== 'collage') {
                const presentationMode = $scope.flashcardsMode === 'presentation';
                modesMap[$scope.flashcardsMode](undefined, presentationMode || undefined);
            }

            flashCards.updateCards(cards);
            animate(cards, oldCards);
        });
    };

    $scope.setFlashcardsHide = function(hide) {
        $scope.hideCards = hide;
        $scope.$evalAsync();
    };

    function initialize() {
        angular.forEach(hotkeysConfig, (value, key) => $scope.initHotkey(() => {}, key));
        const asyncResize = debounce(() => { $scope.$evalAsync(); }, 100);

        flashCards.initialize(activityModel, fireBaseAppModel);

        const win = $(window);
        const container = $('.flashcard-board');

        // Delete selected cards handler
        $scope.initHotkey($scope.deleteCard, 'backspace');
        $scope.initHotkey($scope.deleteCard, 'del');
        $scope.$on('$destroy', () => {
            win.off('resize', asyncResize);
        });
        let styleTag = null;

        function resizeHandler(e) {

            const canonicWidth = 1024;
            const canonicHeight = 768;
            const canonicRatio = canonicWidth / canonicHeight;

            const realWidth = container.width();
            const realHeight = container.height();
            const realRatio = realWidth / realHeight;

            const scale = canonicRatio > realRatio ?
                        realWidth / canonicWidth :
                        realHeight / canonicHeight;

            $scope.scale = scale;

            html.find('.flashcard-scale-wrapper')
                .css('transform', `scale3d(${scale}, ${scale}, ${scale})`);

            if ($scope.isFirefox) {
                if (!styleTag) {
                    styleTag = $('<style type="text/css"></style>').appendTo('head');
                }

                const inverseScale = 1 / scale;
                styleTag.html(
                    `.marching-ants {
                        background-size:
                            10px ${inverseScale}px,
                            10px ${inverseScale}px,
                            ${inverseScale}px 10px,
                            ${inverseScale}px 10px !important;
                    }
                    .flashcard-board .card {
                        border: none !important;
                        background-size:
                            10px ${inverseScale}px,
                            10px ${inverseScale}px,
                            ${inverseScale}px 10px,
                            ${inverseScale}px 10px !important;'
                        background-position: 0 0,  0 100%,  0 0,  100% 0 !important;
                        background-repeat: repeat-x,  repeat-x,  repeat-y,  repeat-y !important;
                        background-image:
                            linear-gradient(to right, #979797 50%, #979797 50%),
                            linear-gradient(to right, #979797 50%, #979797 50%),
                            linear-gradient(to bottom, #979797 50%, #979797 50%),
                            linear-gradient(to bottom, #979797 50%, #979797 50%) !important;
                        }
                    .flashcard-board .select .rotate::before {
                        width: ${inverseScale}px !important;
                    }`,
                );
            }
        }

        win.on('resize', asyncResize);
        $scope.$watch(() => container.width(), resizeHandler);
        $scope.$watch(() => sessionStorage.getItem('activeDrawer'), resizeHandler);
        resizeHandler(undefined);

        activityModel.channel.bind('flashcardsMode', (trans, mode) => {
            $timeout.cancel(fadeInTimeout);
            if (mode === 'collage') {
                trans.delayReturn(true);

                flashCards.setCollageRandom(Math.random(), () => {
                    $scope.setFlashcardsMode(mode, false, true);
                    trans.complete();
                });
            }

            $scope.setFlashcardsMode(mode, false, true);
        });

        activityModel.channel.bind('flashcardsHide', (trans, hide) => {
            $scope.setFlashcardsHide(hide);
        });

        activityModel.channel.bind('flashcardDragging', (trans, card) => {
            $scope.dragInit(card);
        });

        activityModel.channel.bind('flashcardsChangeShowTitle', (trans, value) => {
            $scope.setShowTitle(value);
        });

        activityModel.channel.bind('addCardsOnWhiteboard', (trans, params) => {
            if (params.all) {
                $scope.presentationMode = false;
                $scope.flashcardsMode = 'default';
                if (params.cards.length > $scope.fadeOutAmount) {
                    flashCards.setMode($scope.flashcardsMode);
                }
            }
            $scope.addCardsOnWhiteboard(params.cards ? params.cards : params);
        });

        activityModel.channel.bind('deselectCards', () => {

            // Remove node(s)
            $($scope.selectedNodes).remove();

            // Forget selected card/nodes
            $scope.selectedNodes.length = 0;
            $scope.selectedCards.length = 0;

            activityModel.channel.call({
                method: 'flashcardsSelected',
                params: $scope.selectedCards,
            });
        });

        $scope.$watch(
            () => flashCards.mode,
            (mode, _mode) => {
                if (mode === $scope.flashcardsMode || mode === _mode) {
                    return;
                }
                $timeout.cancel(fadeInTimeout);

                // Not sure why we were resetting cards to start each time, but this
                // causes them to reset when the client joins the room; removing.
                // if (mode === 'presentation' && _mode) {
                //     $scope.activeCard = 0;
                //     $scope.nextCard = $scope.cards.length > 1 ? 1 : null;
                //     $scope.prevCard = null;
                // }

                $scope.setFlashcardsMode(mode);
            },
        );

        $scope.$watch(
            () => flashCards.hide,
            (hide) => {
                if (hide === $scope.hideCards) {
                    return;
                }

                $scope.$evalAsync(() => $scope.hideCards = hide);
            },
        );

        $scope.$watch(
            () => flashCards.collageRandom,
            collageRandom => $scope.$evalAsync(() => {
                $scope.collageRandom = collageRandom;

                if ($scope.flashcardsMode === 'collage') {
                    $scope.setFlashcardsMode($scope.flashcardsMode);
                }
            }),
        );

        $scope.$watch(
            () => flashCards.presentationActiveCard,
            (index) => {
                if ($scope.flashcardsMode !== 'presentation') {
                    return;
                }

                $scope.recalcPresentationActiveCard(index);
            },
        );

        const unwatch = $scope.$watch(
            () => $scope.hideCards !== null && flashCards.isInitialized,
            (value) => {
                if (value) {
                    $('.flashcard-board').addClass('animated');
                    unwatch();
                }
            },
        );
    }

    activityModel.foundationLoaded.then(() => {
        initialize();
    });

}

const flashcardsController2 = angular.module('toys').controller('FlashcardsController', [
    '$scope',
    '$timeout',
    '$window',
    'flashCards',
    'activityModel',
    'firebaseAppModel',
    'currentUserModel',
    'FLASH_CARDS_OPTIONS',
    'RoomClickService',
    'hotkeys',
    'iPadSupportService',
    flashcardsController,
]);
