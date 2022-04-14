import * as EventEmitter from 'events';

export class PromisableEventEmitter extends EventEmitter {
    _events: any;

    /**
     * Overriding EventEmitter's emit method to make it expect for promises from the listeners return
     * and make it promisable as well
     *
     * @param type
     * @returns {Promise}
     */
    //
    emit(type: any, ...promiseArgs: any[]): any {
        let er;
        let handler;
        let len;
        let args;
        let i;
        let listeners;
        const promises = [];

        if (!this._events) {
            this._events = {};
        }

        if (type === 'error') {
            if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)) {
                er = arguments[1];

                if (er instanceof Error) {
                    throw er; // Unhandled 'error' event
                }

                throw TypeError('Uncaught, unspecified "error" event.');
            }
        }

        handler = this._events[type];

        if (isUndefined(handler)) {
            return Promise.all(promises);
        }

        if (isFunction(handler)) {
            switch (arguments.length) {
                // fast cases
                    case 1:
                        {
                            addPromise(promises, handler.call(this));
                            break;
                        }
                    case 2:
                        {
                            addPromise(promises, handler.call(this, arguments[1]));
                            break;
                        }
                    case 3:
                        {
                            addPromise(promises, handler.call(this, arguments[1], arguments[2]));
                            break;
                        }
                    default:
                        {
                            len = arguments.length;
                            args = []; // new Array(len - 1);

                            for (i = 1; i < len; i++) {
                                args[i - 1] = arguments[i];
                            }

                            addPromise(promises, handler.apply(this, args));
                        }
            }
        } else if (isObject(handler)) {
            len = arguments.length;
            args = []; // new Array(len - 1);

            for (i = 1; i < len; i++) {
                args[i - 1] = arguments[i];
            }

            listeners = handler.slice();
            len = listeners.length;

            for (i = 0; i < len; i++) {
                addPromise(promises, listeners[i].apply(this, args));
            }
        }

        return Promise.all(promises);
    }

}

function addPromise(where, promise) {
    if (promise && isFunction(promise.then)) {
        where.push(promise);
    }
}

function isFunction(arg) {
    return typeof arg === 'function';
}

function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
    return arg === void 0;
}
