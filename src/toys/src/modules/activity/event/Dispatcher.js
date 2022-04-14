/**
 * Dispatcher for lightweight event dispatching
 *
 * @param $log
 * @param $state
 */
var Dispatcher = function($log) {

    /****************
     * Storage
     ****************/

    /**
     * The listenerStore contains an entry for each register event and an array of listenerEntry objects
     * that are used to call back when the event is 'dispatched'
     * @type {{}}
     */
    var listenerStore = {};

    /****************
     * API
     ****************/

    /**
     * Invokes the callbacks registered for this event.
     * @param event
     */
    var dispatch = function(event, eventId, args) {
        var listeners = listenerStore[event];
        if (listeners) {
            for (var i=0; i<listeners.length; i++) {
                var entry = listeners[i];
                //if the event has no id, then every callback will be invoked
                if (eventId == undefined) {
                    dispatchEvent(entry, event, eventId, args);
                    //if the eventId exists on the event then only matching events will be invoked
                } else if (entry.eventId === eventId) {
                    dispatchEvent(entry, event, eventId, args);
                    //if the listener has no eventId, then it will receive all events for this EventType
                } else if (entry.eventId == undefined) {
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
    var addListener = function(eventType, eventId, callback, context) {

        //create listener object
        var listenerEntry = {};
        listenerEntry.eventType = eventType;
        listenerEntry.eventId = eventId;
        listenerEntry.callback = callback;
        listenerEntry.context = context;

        //add the listener object to the store where appropriate
        if (listenerStore[eventType] == undefined) {
            listenerStore[eventType] = [listenerEntry];
        } else if (!hasListener(eventType, callback, context)) {
            var listeners = listenerStore[eventType];
            listeners.push(listenerEntry);
        } else {
            $log.debug("[Dispatcher] event listener already registered for event: " + eventType + " id: " + eventId);
        }

    };
    this.addListener = addListener;

    /**
     * Removes this listener for this event
     * @param event
     * @param callback
     */
    var removeListener = function(event, eventId, callback) {
        if (listenerStore[event] != undefined) {
            var listeners = listenerStore[event];
            for (var i=0; i<listeners.length; i++) {
                var entry = listeners[i];
                if (entry.event === event &&
                    entry.callback === callback) {
                    delete listeners[i];
                    break;
                }
            }
            //clear the store entry if the last listener is removed
            if (listeners.length == 0) {
                delete listenerStore[event];
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
    var hasListener = function(event, eventId, callback) {
        if (listenerStore[event] != undefined) {
            var listeners = listenerStore[event];
            for (var i=0; i<listeners.length; i++) {
                var entry = listeners[i];
                if (entry.event === event &&
                    entry.eventId == eventId &&
                    entry.callback === callback) {
                    return true;
                }
            }
        }
        return false;
    };
    this.hasListener = hasListener;


    /****************
     * Internal functions
     ***************/
    var dispatchEvent = function(entry, eventType, eventId, payload) {
        var event = {};
        event.type = eventType;
        event.eventId = eventId;
        $log.debug("[Dispatcher] dispatching event: " + event + " eventType: " + eventType + " eventId: " + eventId);
        entry.callback.apply(entry.context, [event, payload]);
    };

    var init = function () {
        $log.debug("[Dispatcher] Creating Dispatcher service");

    };
    init();

};

Dispatcher.$inject = ['$log'];
module.exports = Dispatcher;
