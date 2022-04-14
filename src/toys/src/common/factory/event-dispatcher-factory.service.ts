import { each } from 'lodash';

// https://github.com/mrdoob/eventdispatcher.js/
const EventDispatcherFactory = function() {
    const EventDispatcher = function() {};

    EventDispatcher.prototype = {
        // constructor: EventDispatcher,
        on: (type, listener) => {
            if (this._listeners === undefined) {
                this._listeners = {};
            }

            const listeners = this._listeners;

            if (listeners[type] === undefined) {
                listeners[type] = [];
            }

            if (listeners[type].indexOf(listener) === -1) {
                listeners[type].push(listener);
            }
        },
        off: (type, listener) => {
            if (this._listeners === undefined) {
                return;
            }

            const listeners = this._listeners;
            const listenerArray = listeners[type];

            if (listenerArray !== undefined) {
                const index = listenerArray.indexOf(listener);
                if (index !== -1) {
                    listenerArray.splice(index, 1);
                }
            }
        },
        once: (type, listener) => {
            throw Error('Not Implemented');
        },
        hasListener: (type, listener) => {
            if (this._listeners === undefined) {
                return false;
            }

            const listeners = this._listeners;

            if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
                return true;
            }
            return false;
        },
        dispatchEvent: (event) => {
            if (this._listeners === undefined) {
                return;
            }

            const listeners = this._listeners;
            const listenerArray = listeners[event.type];

            if (listenerArray !== undefined) {
                event.target = this;
                const array = [];

                const length = listenerArray.length;
                for (let i = 0; i < length; i++) {
                    array[i] = listenerArray[i];
                }

                for (let i = 0; i < length; i++) {
                    array[i].call(this, event);
                }
            }
        },
    };

    EventDispatcher.apply = function(object) {
        const methods = ['on', 'off', 'once', 'dispatchEvent', 'hasListener'];
        each(methods, (item) => {
            object.prototype[item] = this.prototype[item];
        });
    };

    return EventDispatcher;
};

import * as angular from 'angular';

const eventDispatcherFactory = angular.module('toys').service('EventDispatcherFactory', [
    EventDispatcherFactory,
]);
