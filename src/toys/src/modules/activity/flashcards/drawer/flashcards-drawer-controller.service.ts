import { find, map, pick, propertyOf, uniq } from 'lodash';
import angular from 'angular';

/**
 * @param {Object} $window
 * @param {Object} $scope
 * @param {Function} $timeout
 * @param {ActivityModel} activityModel
 * @param {FirebaseAppModel} fireBaseAppModel
 * @param {FlashCards} flashCards
 * @param {RoomClickService} RoomClickService
 * @constructor
 */
let FlashcardsDrawerController = function(
    $window,
    $scope,
    $timeout,
    activityModel,
    fireBaseAppModel,
    flashCards,
    RoomClickService,
    $rootScope,
) {

    // notify FlashcardController about key event on drawer
    const fields = ['keyCode', 'charCode', 'shiftKey', 'metaKey', 'altKey', 'ctrlKey', 'type'];
    const html = $window.$('html');

    html.on('keydown', (e) => {
        activityModel.channel.call({
            method: 'PL-Remote-Dispatcher::event',
            params: pick(e, fields),
        });
    });

    $scope.flashcardsOnBoard = [];
    $scope.gotInitiatedList = false;

    function updateFlashcardsOnBoard(params) {
        $scope.$evalAsync(() => {

            if (!$scope.gotInitiatedList && params.isInitialized) {
                $scope.gotInitiatedList = true;
            }

            $scope.flashcardsOnBoard = params.cards;
        });
    }

    $scope.showCards = true;
    $scope.showTitle = true;
    $scope.showTitleGrayed = false;

    function updateShowTitleStatus(selectedCards) {
        const cards = selectedCards.length
                    ? selectedCards
                    : $scope.flashcardsOnBoard;

        const hideTitlesValues = map(cards, 'type');

        if (hideTitlesValues.length) {
            $scope.showTitle = hideTitlesValues[0] === 'both';
        } else {
            $scope.showTitle = true;
        }

        if (selectedCards.length) {
            checkShowTitleGrayed(hideTitlesValues);
        }

        $scope.$evalAsync();
    }

    function checkShowTitleGrayed(hideTitlesValues) {
        $scope.showTitleGrayed = uniq(hideTitlesValues).length > 1;

        if ($scope.showTitleGrayed) {
            $scope.showTitle = false;
        }
    }

    $scope.onShowTitleChange = function() {
        const value = $scope.showTitle;
        activityModel.channel.call({
            method: 'flashcardsChangeShowTitle',
            params: value,
        });

        $scope.showTitleGrayed = false;
        $timeout();
    };

    activityModel.foundationLoaded.then(() => {
        activityModel.channel.bind('flashcardsOnBoard', (trans, params) => updateFlashcardsOnBoard(params));
        activityModel.channel.bind(
            'flashcardsSelected',
            (trans,  selectedCards) => updateShowTitleStatus(selectedCards));
    });

    $scope.activity = activityModel.activity;
    $scope.flashcardsModel = flashCards;

    $scope.showViewSwitcher = true; // May persist in cookies

    $scope.toggleViewSwitcher = function() {
        $scope.showViewSwitcher = !$scope.showViewSwitcher;
    };

    $scope.$watch(
        () => flashCards.hide,
        hide => ($scope.showCards = !hide),
    );

    $scope.activityLoaded = function() {
        return !!(propertyOf(fireBaseAppModel)('app.activeActivity') || activityModel.activity.config);
    };

    $scope.setFlashcardsNone = function(forceHide) {
        if (!$scope.activityLoaded() || !activityModel.channel) {
            return;
        }

        let newHideValue = forceHide;

        if (newHideValue === undefined) {
            newHideValue = !$scope.showCards;
        }

        activityModel.channel.call({
            method: 'flashcardsHide',
            params: newHideValue,
            success: () => {
                flashCards.setHideCards(newHideValue);
            },
        });

        $scope.$evalAsync();
    };

    $scope.setFlashcardsMode = function(mode) {

        if (!$scope.activityLoaded() || !activityModel.channel) {
            return;
        }

        activityModel.channel.call({
            method: 'flashcardsMode',
            params: mode,
            success: () => {
                flashCards.isLocalEvent = true;
                activityModel.activity.mode = mode;
                flashCards.setMode(mode);
                $scope.setFlashcardsNone(false);
            },
        });
    };

    $scope.deleteAllCards = () => {
        // Without this, if in grid mode, it will still not call animate,
        // which leads to a delay before cards are removed.
        $rootScope.$broadcast('flashcardsClearAnimated');
        flashCards.deleteCards(flashCards.cards);
        // This is a pseudo hack to remove the presentation arrows.
        $scope.setFlashcardsMode('grid');

        activityModel.channel.call({
            method: 'deselectCards',
        });
    };

    $scope.addAllCards = function() {
        if (!flashCards.isLinksReady()) {
            return;
        }

        const cards = $scope.getCards();

        if (!cards || !cards.length) {
            return;
        }

        activityModel.channel.call({
            method: 'addCardsOnWhiteboard',
            params: {
                cards,
                all: true,
            },
        });
    };

    const img = document.createElement('img');
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    $scope.startDrag = function(e, card) {
        if (!$scope.gotInitiatedList) {
            return false;
        }

        RoomClickService.trigger('drawer', 'dragStart');
        e.dataTransfer.effectAllowed = 'move';

        const data = JSON.stringify(card);

        e.dataTransfer.setData('flashcard', data);
        e.dataTransfer.setDragImage(img, 0, 0);

        activityModel.channel.call({
            method: 'flashcardDragging',
            params: card,
        });
    };

    $scope.cancelDrag = function(e) {
        if (!activityModel.channel) {
            return false;
        }

        activityModel.channel.call({
            method: 'flashcardDragging',
            params: null,
        });
    };

    $scope.getCards = function() {
        let cards = propertyOf($scope)('activity.config.cards');

        if (cards && cards.length) {
            cards = cards.filter((card) => {
                return !find($scope.flashcardsOnBoard, { url: card.url, title: card.title });
            });
        }

        return cards;
    };
};
const flashcardsDrawerController = angular.module('toys').controller('FlashcardsDrawerController', [
    '$window',
    '$scope',
    '$timeout',
    'activityModel',
    'firebaseAppModel',
    'flashCards',
    'RoomClickService',
    '$rootScope',
    FlashcardsDrawerController,
]);
