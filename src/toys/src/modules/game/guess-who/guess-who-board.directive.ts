import GuessWhoBoardController  from './Guess-who-board-controller';

let GuessWhoBoardDirective;
GuessWhoBoardDirective = function () {
    return {
        require: ['guessWhoBoard', '^^guessWhoCommunicator'],
        restrict: 'E',
        template: require('./guess-who-board.directive.html'),
        scope: true,
        link: (scope, element, attributes, controllers) => {
            const [guessWhoBoardController, guessWhoCommunicatorController] = controllers;

            guessWhoCommunicatorController.registerBoard(guessWhoBoardController);
        },
        controller: GuessWhoBoardController,
        controllerAs: 'guessWhoBoardController',
    };
};

import * as angular from 'angular';

const guessWhoBoard = angular.module('toys').directive('guessWhoBoard', [
    GuessWhoBoardDirective,
]);
