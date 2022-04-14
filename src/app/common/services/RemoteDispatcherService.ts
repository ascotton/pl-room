import { pick } from 'lodash';

declare var Channel: any;

const RemoteDispatcher = function($log, $q, guidService) {
    'use strict';

    const listenerConnections = [];
    const notifierConnections = [];

    const CALLBACK_SCOPE = 'PL-Remote-Dispatcher';
    this.CALLBACK_SCOPE = CALLBACK_SCOPE;

    const CUSTOM_EVENT_NAME = 'pl_event';
    this.CUSTOM_EVENT_NAME = CUSTOM_EVENT_NAME;

    const createChannel = function(frame) {
        return Channel.build({
            window: frame,
            origin: '*',
            scope: CALLBACK_SCOPE
        });
    };

    const createConnection = function(elements, frame) {
        const channel = createChannel(frame);
        const elementsArray = Array.isArray(elements) ? elements : [elements];
        const connection = {
            channel: channel,
            elements: elementsArray,
            frame: frame,
            id: guidService.generateUUID
        };
        return connection;
    };

    /**
     * creates a custom event object for remote dispatching
     * @param {String} type - The type of event, e.g. 'whiteboard_textedit'
     * @param {Object} data - dictionary of parameters for the event, e.g. {'textEdit':true}
     */
    this.createCustomEventObject = function(type, data) {
        const event: any = jQuery.Event(CUSTOM_EVENT_NAME);
        event.eventType = type;
        event.eventData = data;
        return event;
    };

    /**
     * local element wants to listen for event callbacks targeted at local frame
     */
    const registerListener = function(elements, frame) {
        const connection = createConnection(elements, frame);
        listenerConnections[connection.id] = connection;
        connection.channel.bind('event', function(trans, eventData) {
            redispatchEvent(trans, eventData, connection);
        });
        return connection.id;
    };
    this.registerListener = registerListener;

    const appendListenerElement = function(connectionId, element) {
        listenerConnections[connectionId].elements.push(element);
    };
    this.appendListenerElement = appendListenerElement;

    const deregisterListener = function(connectionId) {
        if (listenerConnections[connectionId]) {
            listenerConnections[connectionId].channel.destroy();
            delete listenerConnections[connectionId];
        }
    };
    this.deregisterListener = deregisterListener;

    this.hasListener = function(connectionId) {
        return listenerConnections[connectionId] !== undefined;
    };

    /**
     * When events happen on local element, broadcast to remote frame
     */
    const registerNotifier = function(elements, frame) {
        const connection = createConnection(elements, frame);
        notifierConnections[connection.id] = connection;
        const keyNotify = function(event) {
            keyEventNotify(event, connection.channel);
        };
        const mouseNotify = function(event) {
            mouseEventNotify(event, connection.channel);
        };
        const customNotify = function(event) {
            customEventNotify(event, connection.channel);
        };
        connection.elements.forEach(function(element) {
            $(element).bind('keydown keyup keypress', keyNotify);
            $(element).bind('mousedown mouseup mouseenter mouseleave', mouseNotify);
            $(element).bind(CUSTOM_EVENT_NAME, customNotify);
        });
        return connection.id;
    };
    this.registerNotifier = registerNotifier;

    const deregisterNotifier = function(connectionId) {
        if (notifierConnections[connectionId]) {
            notifierConnections[connectionId].channel.destroy();
            delete notifierConnections[connectionId];
        }
    };
    this.deregisterNotifier = deregisterNotifier;

    this.hasNotifier = function(connectionId) {
        return notifierConnections[connectionId] !== undefined;
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Broadcast event to remote
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     *  Strips a key event down to a minimal set of fields, no functions, for transport
     */
    const trimKeyEvent = function(event) {
        const fields = ['keyCode', 'charCode', 'shiftKey', 'metaKey', 'altKey', 'ctrlKey', 'type'];
        return pick(event, fields);
    };
    const keyEventNotify = function(event, channel) {
        const trimmedEvent = trimKeyEvent(event.originalEvent);
        channel.notify({
            method: 'event',
            params: trimmedEvent
        });
    };
    const trimMouseEvent = function(event) {
        const mouseFields = ['altKey', 'button', 'buttons', 'clientX', 'clientY', 'ctrlKey',
            'metaKey', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX',
            'screenY', 'shiftKey', 'timeStamp', 'type', 'which'
        ];
        return pick(event, mouseFields);
    };
    const mouseEventNotify = function(event, channel) {
        const trimmedEvent = trimMouseEvent(event.originalEvent);
        channel.notify({
            method: 'event',
            params: trimmedEvent
        });
    };

    const customEventNotify = function(event, channel) {
        channel.notify({
            method: 'event',
            params: event
        });
    };

    /**
     * Receive event on channel and dispatch.  hotkeys only responds to a carefull reconstructed event
     * dispatched with native dipatchEvent. our mouse bindings on the other hand can be triggered with
     * jquery (and in fact are unresponsive to dispatchEvent calls)
     */
    const redispatchEvent = function(trans, eventData, listener) {
        if (eventData.type.indexOf('key') >= 0) {
            const event = buildKeyboardEvent(eventData);
            setTimeout(function() {
                listener.elements.forEach(function(element) {
                    element.dispatchEvent(event);
                });
            }, 0);
        } else  if (eventData.type.indexOf('mouse') >= 0 || eventData.type === CUSTOM_EVENT_NAME) {
            setTimeout(function() {
                listener.elements.forEach(function(element) {
                    $(element).trigger(eventData);
                });
            }, 0);
        }
    };

    const buildKeyboardEvent = function(eventData) {
        const keyboardEvent = (<any>document).createEventObject ? (<any>document).createEventObject() : document.createEvent('Events');
        if (keyboardEvent.initEvent) {
            keyboardEvent.initEvent(eventData.type, true, true);
        }
        keyboardEvent.keyCode = eventData.keyCode;
        keyboardEvent.which = eventData.charCode || eventData.keyCode;
        keyboardEvent.shiftKey = eventData.shiftKey;
        keyboardEvent.metaKey = eventData.metaKey;
        keyboardEvent.altKey = eventData.altKey;
        keyboardEvent.ctrlKey = eventData.ctrlKey;
        return keyboardEvent;
    };
};

 import { commonServicesModule } from './common-services.module';
commonServicesModule.service('remoteDispatcherService', ['$log', '$q', 'guidService', RemoteDispatcher]);
