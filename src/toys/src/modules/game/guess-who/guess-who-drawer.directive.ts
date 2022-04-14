
class GuessWhoDrawerController {
    autoSelect: boolean;
    communicator: any;
    xRay: any;

    constructor() {
        this.autoSelect = false;
        this.reset = this.reset.bind(this);
        this.setXRay = this.setXRay.bind(this);
        this.setAutoSelect = this.setAutoSelect.bind(this);
    }

    registerCommunicator(communicator) {
        this.communicator = communicator;
    }

    setXRay(value) {
        value = value !== undefined ? value : this.xRay;
        this.communicator.setXRay(value);
    }

    setAutoSelect(value) {
        value = value !== undefined ? value : this.autoSelect;
        this.communicator.setAutoSelect(value);
    }

    getAutoSelect(value) {
        return this.communicator.getAutoSelect();
    }

    reset() {
        this.communicator.reset();
    }
}

GuessWhoDrawerController.$inject = [];

/**
 * Directive for text chat
 *
 * @param $log
 * @constructor
 */
let GuessWhoDrawerDirective;
GuessWhoDrawerDirective = function () {
    return {
        require: ['guessWhoDrawer', '^^guessWhoCommunicator'],
        restrict: 'E',
        template: require('./guess-who-drawer.directive.html'),
        scope: true,
        link: function link(scope, element, attributes, controllers) {
            const [guessWhoDrawer, guessWhoCommunicator] = controllers;

            guessWhoCommunicator.registerDrawer(guessWhoDrawer);
            guessWhoDrawer.registerCommunicator(guessWhoCommunicator);
            scope.$watch(() => guessWhoDrawer.getAutoSelect(),  value => guessWhoDrawer.autoSelect = value);
        },
        controller: GuessWhoDrawerController,
        controllerAs: 'guessWhoDrawerController',
    };
};

import * as angular from 'angular';

const guessWhoDrawer = angular.module('toys').directive('guessWhoDrawer', [
    GuessWhoDrawerDirective,
]);
