/**
 * Dispatcher for lightweight event dispatching
 *
 * @param $log
 * @param $state
 */
const Dispatcher = function($log) {

    /****************
     * Storage
     ****************/

    /**
     * The listenerStore contains an entry for each register event and an array of listenerEntry objects
     * that are used to call back when the event is 'dispatched'
     * @type {{}}
     */
    const listenerStore = {};

    /****************
     * API
     ****************/

    /**
     * Invokes the callbacks registered for this event.
     * @param event
     */
    const dispatch = function(event, eventId, args) {
        const listeners = listenerStore[event];
        if (listeners) {
            for (let i = 0; i < listeners.length; i++) {
                const entry = listeners[i];
                // if the event has no id, then every callback will be invoked
                if (eventId === undefined) {
                    dispatchEvent(entry, event, eventId, args);
                    // if the eventId exists on the event then only matching events will be invoked
                } else if (entry.eventId === eventId) {
                    dispatchEvent(entry, event, eventId, args);
                    // if the listener has no eventId, then it will receive all events for this EventType
                } else if (entry.eventId === undefined) {
                    dispatchEvent(entry, event, eventId, args);
                }
            }
        }
    };
    this.dispatch = dispatch;

    /**
     * Adds a listener for this event.
     * @param event
     * @param eventId
     * @param callback
     * @param context
     */
    const addListener = function(eventType, eventId, callback, context) {

        // create listener object
        const listenerEntry: any = {};
        listenerEntry.eventType = eventType;
        listenerEntry.eventId = eventId;
        listenerEntry.callback = callback;
        listenerEntry.context = context;

        // add the listener object to the store where appropriate
        if (listenerStore[eventType] === undefined) {
            listenerStore[eventType] = [listenerEntry];
        } else if (!hasListener(eventType, eventId, callback)) {
            const listeners = listenerStore[eventType];
            listeners.push(listenerEntry);
        } else {
            $log.debug('[Dispatcher] event listener already registered for event: ' + eventType + ' id: ' + eventId);
        }

    };
    this.addListener = addListener;

    /**
     * Removes this listener for this event
     * @param event
     * @param callback
     */
    const removeListener = function(eventType, eventId, callback) {
        if (listenerStore[eventType] !== undefined) {
            const listeners = listenerStore[eventType];
            for (let i = 0; i < listeners.length; i++) {
                const entry = listeners[i];
                if (entry.eventType === eventType &&
                    entry.callback === callback) {
                    listeners.splice(i, 1);
                    break;
                }
            }
            /**
             * delete makes element undefined and array
             * will be with size 1 in case of [undefined]
             */
            // clear the store entry if the last listener is removed
            if (listeners.length === 0) {
                delete listenerStore[eventType];
            }
        }
    };
    this.removeListener = removeListener;

    /**
     * Checks is their is an existing handler for this event and listener combination
     * @param event
     * @param callback
     * @returns {boolean}
     */
    const hasListener = function(eventType, eventId, callback) {
        let result = false;
        if (listenerStore[eventType] !== undefined) {
            const listeners = listenerStore[eventType];
            listeners.forEach((entry) => {
                if (entry.eventType === eventType &&
                    entry.eventId === eventId &&
                    entry.callback === callback) {
                    result = true;
                }
            });
        }
        return result;
    };
    this.hasListener = hasListener;


    /****************
     * Internal functions
     ***************/
    const dispatchEvent = function(entry, eventType, eventId, payload) {
        const event: any = {};
        event.type = eventType;
        event.eventId = eventId;

        if (payload && payload.event && payload.event.manualStopPropagation === true) {
            return;
        }

        $log.debug('[Dispatcher] dispatching event: ' + event + ' eventType: ' + eventType + ' eventId: ' + eventId);

        return entry.callback.apply(entry.context, [event, payload]);
    };

    const init = function() {
        $log.debug('[Dispatcher] Creating Dispatcher service');

    };
    init();

};

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('dispatcherService', ['$log', Dispatcher]);

