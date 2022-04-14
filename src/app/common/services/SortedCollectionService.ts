import { bind, defer } from 'lodash';

const SortedCollectionService = function($log) {

    let baseRef = null;
    let eventCallback: any = null;
    let elements: any = [];
    const listeners = [];

    /*********************************
     * API METHODS
     ********************************/
    this.createCollection = function(firebaseRef, callback) {
        $log.debug('[SortedCollection] createCollection');
        baseRef = firebaseRef;
        eventCallback = callback;
        resetList();
        setupListeners();
        setupApi();
        // return the list
        return elements;
    };

    const generateId = function() {
        $log.debug('[SortedCollection] creating sorted key');
        const childRef = baseRef.push();
        return childRef.key;
    };

    const add = function(key, element, priority) {
        $log.debug('[SortedCollection] add');
        if (arguments.length === 2) {
            // push and set
            set(key, element);
        } else if (arguments.length === 3) {
            // push and set with priority
            setWithPriority(key, element, priority);
        }
    };

    const set = function(key, value) {
        $log.debug('[SortedCollection] set');
        baseRef.child(key).set(value, bind(handleComplete, this));
    };

    const setWithPriority = function(key, value, priority) {
        baseRef.child(key).setWithPriority(value, priority);
    };

    const update = function(key, value) {
        $log.debug('[SortedCollection] update');
        baseRef.child(key).update(value, bind(handleComplete, this));
    };

    const bulkUpdate = function(bulkObject) {
        $log.debug('[SortedCollection] bulk update');
        baseRef.update(bulkObject, bind(handleComplete, this));
    };

    const setPriority = function(key, priority) {
        $log.debug('[SortedCollection] setPriority');
        baseRef.child(key).setPriority(priority);
    };

    const remove = function(key) {
        $log.debug('[SortedCollection] remove');
        baseRef.child(key).remove(bind(handleComplete, this));
    };

    const removeAll = function() {
        $log.debug('[SortedCollection] removing all from the collection');
        baseRef.remove();
    };


    const getElement = function(key) {
        $log.debug('[SortedCollection] getElement');
        const i = findKeyIndex(key, true);
        if (i !== -1) {
            return elements[i];
        }
    };

    /*********************************
     * PRIVATE METHODS
     ********************************/
    const resetList = function() {
        // clean up?
        elements = [];
    };

    const setupListeners = function() {
        addListener('child_added', handleChildAdded);
        addListener('child_removed', handleChildRemoved);
        addListener('child_changed', handleChildChanged);
        addListener('child_moved', handleChildMoved);
        addListener('value', handleValueChange);
    };

    const setupApi = function() {
        elements.indexOf = bind(findKeyIndex, this);
        elements.generateId = bind(generateId, this);
        elements.add = bind(add, this);
        elements.set = bind(set, this);
        elements.setWithPriority = bind(setWithPriority, this);
        elements.update = bind(update, this);
        elements.bulkUpdate = bind(bulkUpdate, this);
        elements.setPriority = bind(setPriority, this);
        elements.remove = bind(remove, this);
        elements.removeAll = bind(removeAll, this);
        elements.getElement = bind(getElement, this);
    };

    const handleChildAdded = function(snapshot, previousChildId) {
        $log.debug('[SortedCollection] handleChildAdded');
        moveTo(snapshot.key, snapshot.val(), previousChildId);
        dispatchEvent('child_added', snapshot.key, snapshot.val());
    };

    const handleChildRemoved = function(snapshot) {
        $log.debug('[SortedCollection] handleChildRemoved');
        const key = snapshot.key;
        const index = findKeyIndex(key, true);
        if (index !== -1) {
            elements.splice(index, 1);
            dispatchEvent('child_removed', snapshot.key, snapshot.val());
        }
    };

    const handleChildChanged = function(snapshot) {
        $log.debug('[SortedCollection] handleChildChanged');
        const key = snapshot.key;
        const index = findKeyIndex(key, true);
        if (index !== -1) {
            elements[index] = updateObject(elements[index], snapshot.val());
            dispatchEvent('child_changed', snapshot.key, snapshot.val());
        }
    };

    const handleChildMoved = function(snapshot, previousChildId) {
        $log.debug('[SortedCollection] handleChildMoved');
        const key = snapshot.key;
        const oldIndex = findKeyIndex(key, true);
        if (oldIndex !== -1) {
            const data = elements[oldIndex];
            elements.splice(oldIndex, 1);
            moveTo(key, data, previousChildId);
            dispatchEvent('child_moved', snapshot.key, data, previousChildId);
        }
    };

    const handleValueChange = function() {
        $log.debug('[SortedCollection] handleValueChange');
    };

    const dispatchEvent = function(eventType, elementId, data, previousChildId?) {
        if (eventCallback) {
            eventCallback(eventType, elementId, data, previousChildId);
        }
    };

    // mutation
    const moveTo = function(key, value, previousChildId) {
        const index = findIndex(key, previousChildId);
        elements.splice(index, 0, value);
    };

    const updateObject = function(oldValue, newValue) {
        // we can do an incremental add here instead
        return newValue;
    };

    const findIndex = function(key, prevChildId) {
        let index;
        if (prevChildId === null) {
            index = 0;
        } else {
            const i = findKeyIndex(prevChildId, true);
            if (i === -1) {
                index = elements.length;
            } else {
                index = i + 1;
            }
        }
        return index;
    };

    const findKeyIndex = function(key, suppressVerify) {
        let index = -1;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (elements[i].name === key) {
                index = i;
                if (suppressVerify !== true) {
                    if (i !== element.index) {
                        defer(function() {
                            element.index = index;
                            update(element.name, element);
                            setPriority(element.name, element.index);
                        });
                    }
                }
                break;
            }
        }
        return index;
    };

    const addListener = function(event, handler) {
        listeners.push([event, baseRef.on(event, handler.bind(this))]);
    };

    const handleComplete = function(error) {
        if (error) {
            $log.debug('[SortedCollection] fb sync error: ' + error);
        } else {
            $log.debug('[SortedCollection] fb sync complete');
        }
    };

    const init = function() {
        $log.debug('[SortedCollectionService] creating SortedCollectionService');
    };
    init();

};

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('sortedCollectionService', ['$log', SortedCollectionService]);
