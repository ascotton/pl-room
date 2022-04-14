class GuessWhoCommunicatorController {
    board: any;
    drawer: any;
    constructor() {
    }

    registerBoard(board) {
        this.board = board;
    }

    registerDrawer(drawer) {
        this.drawer = drawer;
    }

    reset() {
        if (this.board) this.board.reset();
    }

    setXRay(value) {
        if (this.board)this.board.setXRay(value);
    }

    setAutoSelect(value) {
        if (this.board) this.board.setAutoSelect(value);
    }

    getAutoSelect() {
        if (this.board) return this.board.getAutoSelect();
    }

    getAlertText() {
        return this.board && this.board.getAlertText();
    }
}

const GuessWhoCommunicatorDirective = function GuessWhoCommunicatorDirective() {
    return {
        scope: true,
        restrict: 'A',
        link: ($scope, $element, $attributes, $controller) => {
            function handler(evt) {
                if (evt.keyCode === 27) {
                    $scope.$evalAsync(() =>
                        $controller.board &&
                        $controller.board.hideMyAvatar &&
                        $controller.board.hideMyAvatar(),
                    );
                }
            }

            $(document).on('keydown', handler);

            $scope.$on('$destroy', () => $(document).off('keydown', handler));
        },
        controller: GuessWhoCommunicatorController,
        controllerAs: 'guessWhoCommunicatorController',
    };
};

import * as angular from 'angular';

const guessWhoCommunicator = angular.module('toys').directive('guessWhoCommunicator', [
    GuessWhoCommunicatorDirective,
]);
