import * as _ from 'lodash';
import * as angular from 'angular';
import * as moment from 'moment';

class PLQueueController {
    static $inject = ['$scope', '$log', 'appModel', 'firebaseModel', 'firebaseAppModel',
        '$state', '$sce', '$timeout', '$window', 'applications',
        'guidService', 'closureService', 'localStorageService', '$interval',
        'envRoom', 'angularCommunicatorService', 'activityValidatorService',
        '$q',
    ];

    activityUndeletes: any;
    queuesRef: any;
    originalQueueState: any;
    popup: any;
    queues: any;
    queueName: any;
    lastDeletedQueueId: string;
    detailView: any;
    queueUndeleteTimer: any;
    directive: any;
    readonly MAX_QUEUE_SIZE = 50;

    localStorageKey: string = 'plQueue';
    localStorageData: any = {};

    seenQueueWarningKey = 'plQueueSeenWarning';
    seenQueueWarning = false;
    wroteQueueWarning = false;

    restoreQueuesList: any[] = [];
    restoringQueues: boolean = false;
    hardDeleteTime: any = 30;
    hardDeleteUnit: string = 'days';
    readonly DATE_FORMAT = 'YYYY-MM-DD HH:mm:ssZ';

    angularCommunicator: any;

    currentQueuePage = 0;

    constructor (
        private $scope,
        private $log,
        private appModel,
        private firebaseModel,
        private firebaseAppModel,
        private $state,
        private $sce,
        private $timeout,
        private $window,
        private applications,
        private guidService,
        private closureService,
        private localStorageService,
        private $interval,
        private envRoom,
        angularCommunicatorService,
        private activityValidatorService,
        private $q,
    ) {
        this.angularCommunicator = angularCommunicatorService;
        this.activityUndeletes = {};

        this.queuesRef = firebaseModel.getFirebaseRef('activities/queues');

        this.originalQueueState = void 0;

        this.popup = 'step-1';
        this.queues = { items: {}, order: [] };

        this.queueName = '';

        this.lastDeletedQueueId = undefined;

        this.queuesRef.child('order').on('value', (ref) => {

            const activeQueueId = this.firebaseAppModel.app.activeQueueId;

            if (activeQueueId) {
                this.activeQueueId = activeQueueId;
                this.firebaseAppModel.setActiveQueueId(null);
            }

            this.loadQueue(this.queues.order, ref.val() || []);
        });

        let localStorageSeenWarning: any = localStorage.getItem(this.seenQueueWarningKey);
        this.seenQueueWarning = localStorageSeenWarning === 'true';

        if (envRoom && envRoom.restoreQueueHardDeleteTime && envRoom.restoreQueueHardDeleteUnit) {
            this.hardDeleteTime = envRoom.restoreQueueHardDeleteTime;
            this.hardDeleteUnit = envRoom.restoreQueueHardDeleteUnit;
        }

        // Remove white screen if not on activities.
        this.$scope.$watch(() => appModel.app.activeDrawer, (val) => {
            if (val !== 'activities') {
                this.firebaseAppModel.setWhiteScreenActive(false);
            }
        });

        // allow for the possibility that another service remotely closes the current 
        // activity and then close the detail drawer.
        this.$scope.$watch(() => firebaseAppModel.app.activeActivity, (val) => {
            if (val === null) {
                this.detailView = false;
            }
        });
    }

    validateAllActivities() {
        const start = new Date().getTime();
        let count = 0;
        this.queuesRef.child('items').once('value', (snap) => {
            const items = snap.val();
            const invalids = [];
            const entries = Object.entries(items);
            entries.forEach(([queueKey, queue]: [string, any]) => {
                if (queue.items) {
                    Object.entries(queue.items).forEach(([activityId, activity]) => {
                        count++;
                        const valid = this.activityValidatorService.checkURLs(activity);
                        if (!valid) {
                            invalids.push({ activity, activityId, queueKey });
                        }
                    });
                }
            });
            const mid = new Date().getTime();
            const elapsed = (mid - start) / 1000;
            console.log(`Validated ${count} activities, found ${invalids.length} invalid ones in ${elapsed} seconds.`);
            if (invalids.length) {
                this.chainPromises(invalids).then(() => {
                    const updateTime = (new Date().getTime() - mid) / 1000;
                    console.log(`Updated all invalids in ${updateTime} seconds.`);
                });
            }
        });
    }

    validateDisplayActivities() {
        const start = new Date().getTime();
        const queue = this.displayQueue;
        const queueId = this.activeQueueId;
        let count = 0;
        const invalids = [];
        queue.forEach((activityId) => {
            const activity = this.activeQueue.items[activityId];
            count++;
            const valid = this.activityValidatorService.checkURLs(activity);
            if (!valid) {
                invalids.push({ activity, activityId, queueId });
            }
        });
        const mid = new Date().getTime();
        const elapsed = (mid - start) / 1000;
        console.log(`Validated ${count} activities, found ${invalids.length} invalid ones in ${elapsed} seconds.`);
        if (invalids.length) {
            this.chainPromises(invalids).then(() => {
                const updateTime = (new Date().getTime() - mid) / 1000;
                console.log(`Updated all invalids in ${updateTime} seconds.`);
            });
        }
    }

    chainPromises(arr) {
        return arr.reduce(
            (promise, invalid: any) => {
                return promise.then(() => {
                    return this.updateActivity(invalid.activity, invalid.activityId, invalid.queueId);
                });
            },
            this.$q.when(),
        );
    }

    updateActivity(activity, activityId, queueId) {
        const deferred = this.$q.defer();
        this.activityValidatorService.refetchActivity(activity).then(
            (updated) => {
                this.queuesRef.child(`items`).child(queueId).child('items').child(activityId).update(
                    updated,
                    (error) => {
                        if (error) {
                            console.log('error updating activity: ', activity);
                            console.log('error: ', error);
                        } else {
                            // console.log('successfully updated activity in firebase (queueKey, activitykey): ', queueKey, activityKey);
                            deferred.resolve(updated);
                        }
                    },
                );
            },
        );
        return deferred.promise;
    }

    setWhiteScreenActive(value) {
        this.firebaseAppModel.setWhiteScreenActive(value);
    }

    loadQueue(orderCurr, orderNext) {
        let initialValidationDone = false;
        this.loadLocalStorage();
        if (this.activeActivity) {
            if (!this.appModel.app.store) {
                this.detailView = true;
                this.$scope.$evalAsync();
            }
        }

        const currQueueIds = new Set(orderCurr);
        const nextQueueIds = new Set(orderNext);

        // creates = next - curr
        const createdQueueIds = new Set([...nextQueueIds].filter(x => currQueueIds.has(x) === false));

        // deletes = curr - next
        const deletedQueueIds = new Set([...currQueueIds].filter(x => nextQueueIds.has(x) === false)); 

        for (const createdQueueId of createdQueueIds) {
            const createdQueueIdString = createdQueueId.toString();
            this.queues.items[createdQueueIdString] = this.queues.items[createdQueueIdString] || {
                items: {},
                order: []
            };

            this.queuesRef.child(`items`).child(`${createdQueueIdString}`).on(
                'value',
                (ref) => {
                    this.queueChangeCallback(createdQueueIdString, ref);
                    if (this.displayQueue.length && !initialValidationDone) {
                        initialValidationDone = true;
                        this.validateDisplayActivities();
                    }
                }
            );
        }

        for (const queueId1 of deletedQueueIds) {
            const queueId = queueId1.toString();
            delete this.queues.items[queueId];
        }

        this.queues.order.length = 0;
        this.queues.order.push(...orderNext);

        if (!this.queues.order.length) {
            const queueId = this.guidService.generateUUID();

            this.queues.items[queueId] = {
                name: 'Queue 1',
                items: {},
                order: []
            };

            this.queues.order.push(queueId);

            this.queuesRef.child('items').child(queueId).set(this.queues.items[queueId]);
            this.queuesRef.child('order').set(this.queues.order);

            this.queuesRef.child(`items`).child(`${queueId}`).on(
                'value',
                (ref) => {
                    this.queueChangeCallback(queueId, ref);
                }
            );
        }
        this.$scope.$evalAsync();
    }

    private queueChangeCallback(queueId1: string, ref: any): any {
        const queueId = queueId1.toString();
        const queue = ref.val();

        if (queue) {
            this.queues.items[queueId].name = queue.name;

            const nextActivityIds = new Set(queue.order || []);
            const currActivityIds = new Set(this.queues.items[queueId].order);

            // creates = next - curr
            const createdActivityIds = new Set([...nextActivityIds].filter(x => currActivityIds.has(x) === false));
            // deletes = curr - next
            const deletedActivityIds = new Set([...currActivityIds].filter(x => nextActivityIds.has(x) === false));

            for (const activityId1 of createdActivityIds) {
                const activityId = activityId1.toString();
                this.queues.items[queueId].items[activityId] = queue.items[activityId];
            }

            for (const activityId1 of deletedActivityIds) {
                const activityId = activityId1.toString();
                delete this.queues.items[queueId].items[activityId];
            }

            if (!this.queues.items[queueId].order) {
                this.queues.items[queueId].order = [];
            }
            this.queues.items[queueId].order.length = 0;
            this.queues.items[queueId].order.push(...nextActivityIds);

            this.$scope.$evalAsync();
        }
        else {
            // let's try to do nothing
        }
    }

    get activeDrawer()  {
        return this.appModel.app.activeDrawer;
    }

    get activeQueue() {
        if (this.queues) {
            let nextActive = this.queues.items[this.activeQueueId];
            this.updateSeenWarning(nextActive);
            return nextActive;
        } else {
            return null;
        }
    }

    set activeQueue(value) {
        this.currentQueuePage = 0;
        this.updateLocalStorage();
        for (const queueId in this.queues.items) {
            if (this.queues.items.hasOwnProperty(queueId)) {
                const queue = this.queues.items[queueId];

                if (queue === value) {
                    this.activeQueueId = queueId;
                    break;
                }
            }
        }
    }

    get activeQueueId() {
        if (this.queues && this.queues.items) {
            // let queueId = this.firebaseAppModel.app.activeQueueId;
            let queueId;
            try {
                queueId = this.localStorageService.get('activeQueueId');
            } catch (e) {
                this.localStorageService.set('activeQueueId', '');
            }

            if (queueId && this.queues.items[queueId]) {
                return queueId;
            }

            if (this.queues.order.length) {
                return this.queues.order[0];
            }
        }
        return null;
    }

    set activeQueueId(queueId) {
        this.currentQueuePage = 0;
        this.updateLocalStorage();
        // this.firebaseAppModel.setActiveQueueId(queueId);
        this.localStorageService.set('activeQueueId', queueId);
        this.validateDisplayActivities();
    }

    updateSeenWarning(nextActive) {
        if (this.seenQueueWarning || this.wroteQueueWarning){
            return;
        }
        const queueSize = nextActive && nextActive.order ? nextActive.order.length : 0;
        if (queueSize > this.MAX_QUEUE_SIZE) {
            localStorage.setItem(this.seenQueueWarningKey, 'true');
            this.wroteQueueWarning = true;
        }
    }

    updateLocalStorage() {
        this.localStorageData.currentQueuePage = this.currentQueuePage;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageData));
    }

    loadLocalStorage() {
        let data: any = localStorage.getItem(this.localStorageKey);
        if (data) {
            data = JSON.parse(data);
            if (data.currentQueuePage) {
                this.currentQueuePage = data.currentQueuePage;
            }
        }
    }

    get displayQueue() {
        const start = this.currentQueuePage * this.MAX_QUEUE_SIZE
        const display = this.activeQueue && this.activeQueue.order ? this.activeQueue.order.slice(start, start + this.MAX_QUEUE_SIZE) : []
        return display;
    }

    get queuePageCount() {
        const count = this.activeQueue && this.activeQueue.order ? Math.ceil(this.activeQueue.order.length / this.MAX_QUEUE_SIZE) : 0;
        return count;
    }

    hasQueuePrevious() {
        return this.currentQueuePage > 0;
    }

    queuePrevious() {
        if (this.hasQueuePrevious()) {
            this.currentQueuePage -= 1;
            this.updateLocalStorage();
            this.validateDisplayActivities();
        }
    }

    hasQueueNext() {
        let length = this.activeQueue && this.activeQueue.order ? this.activeQueue.order.length : 0;
        return this.currentQueuePage * this.MAX_QUEUE_SIZE < length - this.MAX_QUEUE_SIZE 
    }

    queueNext() {
        if (this.hasQueueNext()) {
            this.currentQueuePage += 1;
            this.updateLocalStorage();
            this.validateDisplayActivities();
        }
    }

    openActivity(activity) {
        if (!this.appModel.app.store) {
            this.detailView = true;
        }
        this.activeActivity = activity;

    }

    set activeActivity(activity) {
        if (!this.firebaseAppModel.app.activeActivity || activity.id !== this.firebaseAppModel.app.activeActivity.id) {
            this.firebaseAppModel.setActiveActivity(activity);
            this.detailView = true;
        }
    }

    get activeActivity() {
        return this.firebaseAppModel.app.activeActivity;
    }

    toggle(value) {
        if (this.isQueued(value)) {
            this.removeFromActiveQueue(value);
        } else {
            this.addToActiveQueue(value);
        }
    }

    getResourceType(activity) {
        let isAssessment, isGame, type = 'activity';
        if (activity.hasOwnProperty('resource_uri')) {
            isAssessment = activity.resource_uri.toLowerCase().indexOf('assessment') >= 0;
            isGame = activity.resource_uri.toLowerCase().indexOf('game') >= 0;
        } else {
            isAssessment = activity.activity_type === 'assessment';
            isGame = activity.activity_type === 'game';
        }
        if (isAssessment) {
            type = 'assessment';
        } else if (isGame) {
            type = 'game';
        }
        return type;
    }

    isQueued(value) {
        return !!~this.indexOf(value);
    }

    indexOf(value) {
        const queue: any = this.activeQueue;
        if (queue) {
            return _.findIndex(queue.order.map(id => queue.items[id]), (a: any) => {
                if (a) {
                    const sameId = a.id === value.id;
                    const sameType = this.getResourceType(a) === this.getResourceType(value);
                    const sameQueue = a.queue === value.queue;

                    return sameId && sameType && sameQueue;
                } else {
                    return false;
                }
            });
        } else {
            return -1;
        }
    }

    editActiveQueueOrdering() {
        this.queuesRef.child('items').child(this.activeQueueId).child('order').set(this.activeQueue.order);
    }

    addToActiveQueue(value, index?) {
        if (value && value.id) {
            if (!this.isQueued(value)) {
                const activityType = this.getResourceType(value);

                const queueId = this.activeQueueId;
                const activityId = this.guidService.generateUUID();
                const activity = {
                    id: value.id,
                    slug: value.slug,
                    queueId: queueId,
                    activityId: activityId,
                    thumbnail_url: value.thumbnail_url,
                    type: activityType === 'game' ? value.game_type : value.activity_type ,
                    activity_type: activityType,
                    name: value.name,
                    session_id: this.guidService.generateUUID() // TODO replace this by whatever mechanism creates the sessions
                };

                this.queuesRef.child('items').child(queueId).child('items').child(activityId).set(activity);

                this.activeQueue.items[activityId] = activity;

                if (_.isUndefined(index)) {
                    this.activeQueue.order.push(activityId);
                } else {
                    this.activeQueue.order.splice(index, 0, activityId);
                }

                this.queuesRef.child('items').child(this.activeQueueId).child('order').set(this.activeQueue.order);
            }
        }
    }

    removeFromActiveQueue(activity) {
        const queueId = this.activeQueueId;
        const queue = this.queues.items[queueId];
        const index = _.isString(activity) ? queue.order.indexOf(activity) : this.indexOf(activity);
        const activityId = queue.order[index];

        activity = queue.items[activityId];
        activity.softDeleted = true;

        const order = queue.order.slice();
        const items = queue.order.map(id => queue.items[id]);

        this.queuesRef.child('items').child(queueId).child('items').child(activityId).remove();
        this.queuesRef.child('items').child(queueId).child('order').set(queue.order.filter(id =>
            queue.items[id] && !queue.items[id].softDeleted)
        );

        for (let i = 0; i < order.length; i++) {
            queue.items[order[i]] = items[i];
        }

        queue.order.length = 0;
        queue.order.push(...order);

        if (!this.activityUndeletes[activityId]) {
            // Native setTimeout function is used intentionally to allow e2e tests react to dom change
            // without waiting for angular $timeouts to finish
            const timeout = this.$interval(() => {
                const index2 = queue.order.indexOf(activityId);

                if (index2 > -1) {
                    delete queue.items[activityId];
                    queue.order.splice(index2, 1);
                }
            }, 5000, 1);

            this.activityUndeletes[activityId] = () => {
                this.$interval.cancel(timeout);

                activity.softDeleted = false;

                const order2 = [];

                for (let i = 0; i < queue.order.length; i++) {
                    const queueId2 = queue.order[i];
                    if (queue.items[queueId2] && !queue.items[queueId2].softDeleted) {
                        order2.push(queueId2);
                    }
                }


                const orderOrig = queue.order.slice();
                const itemsOrig = queue.order.map(id => queue.items[id]);

                this.queuesRef.child('items').child(queueId).child('items').child(activityId).set(activity);
                this.queuesRef.child('items').child(queueId).child('order').set(order2);

                for (let i = 0; i < orderOrig.length; i++) {
                    queue.items[orderOrig[i]] = itemsOrig[i];
                }

                queue.order.length = 0;
                queue.order.push(...orderOrig);

                delete this.activityUndeletes[activityId];
            };
        }
    }

    unremoveFromActiveQueue(activity) {
        const queueId = this.activeQueueId;
        const queue = this.queues.items[queueId];

        const index = _.isString(activity)
            ? queue.order.indexOf(activity)
            : this.indexOf(activity);

        const activityId = queue.order[index];

        this.activityUndeletes[activityId]();
    }

    create(queueName) {
        if (!queueName) {
            let i = 1;

            const list = this.queues.order.map((j) => this.queues.items[j].name);

            while (list.indexOf('Queue ' + i) >= 0) {
                i++;
            }

            queueName = 'Queue ' + i;
        }

        const queueId = this.guidService.generateUUID();
        const queue = {
            name: queueName,
            items: {},
            order: []
        };

        const newOrder = this.queues.order.slice();
        newOrder.unshift(queueId);

        // this.queues.order.unshift(queueId);
        this.queues.items[queueId] = queue;

        this.queuesRef.child('items').child(queueId).set(queue);
        this.queuesRef.child('order').set(newOrder);

        this.queues.order = newOrder;

        this.activeQueueId = queueId;
    }

    onSortQueues() {
        this.queuesRef.child('order').set(this.queues.order);
    }

    createDisabled () {
        return this.queues.order.length < 50;
    }

    editQueueName(e) {
        this.popup = 'step-2';
        this.$timeout( () => {
            this.directive.focusOnQueueName();
        }, 100);

    }

    addItems() {
        this.angularCommunicator.queueAddDone = false;
        this.angularCommunicator.activeQueueId = this.activeQueueId;
        this.angularCommunicator.activeQueueName = this.activeQueue.name;
    }

    openStore() {
        // Use FireBase as cross-window communication layer
        //
        this.firebaseAppModel.setActiveQueueId(this.activeQueueId);

        const storeURL = this.applications.toychest.url;
        const newWindow = this.$window.open(storeURL, '_blank');
        newWindow.focus();
    }

    removeActiveQueue(keepQueue = false) {
        this.hardDeleteOldQueues();

        const queueId = this.activeQueueId;

        if (!this.originalQueueState) {
            this.originalQueueState = {
                deletes: 0,
                order: this.queues.order.slice(),
                items: this.queues.order.map(id => JSON.parse(JSON.stringify(this.queues.items[id])))
            };
        }

        this.originalQueueState.deletes++;

        if (keepQueue) {
            this.queuesRef.child('items').child(queueId).child('items').remove();
            this.queuesRef.child('items').child(queueId).child('order').remove();

            const activeQueue = this.activeQueue;

            this.lastDeletedQueueId = activeQueue.queueId;

            activeQueue.cleared = true;
            activeQueue.order.forEach(id => {
                delete activeQueue.items[id];
            });

            activeQueue.items.length = 0;

        } else {
            // this.queuesRef.child('items').child(queueId).remove();
            this.queuesRef.child('items').child(queueId).child('deletedDate').set(moment().format(this.DATE_FORMAT));

            delete this.queues.items[queueId];

            this.lastDeletedQueueId = queueId;

            const index = this.queues.order.indexOf(queueId);
            this.queues.order.splice(index, 1);
            this.queuesRef.child('order').set(this.queues.order);

            if (index >= this.queues.order.length) {
                this.activeQueueId = this.queues.order[this.queues.order.length - 1];
            } else {
                this.activeQueueId = this.queues.order[index];
            }
        }

        if (this.queueUndeleteTimer) {
            this.$timeout.cancel(this.queueUndeleteTimer);
        }

        this.queueUndeleteTimer = this.$timeout(() => {
            this.originalQueueState = null;
        }, 5000);

        const doc = angular.element(document);

        if (doc && doc.trigger) {
            doc.trigger('closeAllDropdowns');
        }
    }

    undoRemoveQueues() {
        this.$timeout.cancel(this.queueUndeleteTimer);

        this.queues.order.length = this.originalQueueState.order.length;

        for (let i = 0; i < this.originalQueueState.order.length; i++) {
            const queue = this.originalQueueState.items[i];
            const queueId = this.originalQueueState.order[i];

            if (!this.queues.items[queueId] || this.queues.items[queueId].cleared) {

                if (this.lastDeletedQueueId && queueId === this.lastDeletedQueueId) {
                    this.activeQueue = queue;
                    this.activeQueueId = queueId;
                }

                this.queues.items[queueId] = queue;
                // this.queuesRef.child('items').child(queueId).set(queue);
                this.queuesRef.child('items').child(queueId).child('deletedDate').remove();
            }

            this.queues.order[i] = queueId;
        }

        this.queuesRef.child('order').set(this.queues.order);

        this.originalQueueState = null;
    }

    selectQueue(queueId) {
        this.activeQueueId = queueId;
        this.popup = false;

        const doc = angular.element(document);

        if (doc && doc.trigger) {
            doc.trigger('closeAllDropdowns');
        }
    }

    getQueueItemClasses(activity) {
        if (activity) {
            const itemState = activity.activity_type === 'activity'
                ? 'app.store.activities.detail'
                : 'app.store.assessments.detail';

            const classes: any = {
                'activity': true,
                'store-queue': this.appModel.app.store,
                'no-thumbnail': !activity.thumbnail_url,
                'active': this.$state.is(itemState, { slug: activity.slug })
            };
            classes[activity.type] = true;
            classes.deleted = activity.softDeleted;

            return classes;
        } else {
            return { };
        }

    }

    handleDirectiveInitialize(directive) {
        this.directive = directive;
    }

    handleKeyPress(name, $event) {
        if ($event.keyCode === 13) {
            if (name) {
                this.activeQueue.name = name;
            }
            this.queuesRef.child('items').child(`${this.activeQueueId}`).child('name').set(this.activeQueue.name);
            this.popup = 'step-1';
        }

        if ($event.keyCode === 27) {
            this.popup = 'step-1';
        }
    }

    getQueueClasses() {
        return {
            'in': this.appModel.app.activeDrawer === 'activities' && this.queues && !this.appModel.drawerIsHidden,
            'panel-2-active': this.detailView,
            'quick-add-active': this.appModel.app.quickAddOpen
        };
    }

    leaveDetail() {
        this.detailView = false;

        const doc = angular.element(document);

        if (doc && doc.trigger) {
            doc.trigger('closeAllDropdowns');
        }

        this.firebaseAppModel.setActiveActivity(null);
    }

    showRestore() {
        this.hardDeleteOldQueues();
        const queues = [];
        this.queuesRef.child('items').on('value', (ref) => {
            for (let queueId in ref.val()) {
                let queue = ref.val()[queueId];
                if (queue.deletedDate) {
                    queues.push({
                        'id': queueId,
                        'name': queue.name,
                        'queue': queue,
                    });
                }
            }
        });
        this.restoreQueuesList = queues;
        this.restoringQueues = true;
    }

    closeRestore() {
        this.restoringQueues = false;
    }

    restoreQueue(queueInfo) {
        this.queues.items[queueInfo.id] = queueInfo.queue;
        this.queues.order.push(queueInfo.id);
        // Remove from restore list.
        this.restoreQueuesList = this.restoreQueuesList.filter((queue) => {
            return queue.id !== queueInfo.id ? true : false;
        });
        this.queuesRef.child('items').child(queueInfo.id).child('deletedDate').remove();
        this.queuesRef.child('order').set(this.queues.order);
    }

    hardDeleteOldQueues() {
        const oldestDate = moment().subtract(this.hardDeleteTime, this.hardDeleteUnit);
        this.queuesRef.child('items').on('value', (ref) => {
            for (let queueId in ref.val()) {
                let queue = ref.val()[queueId];
                if (moment(queue.deletedDate, this.DATE_FORMAT) < oldestDate) {
                    this.queuesRef.child('items').child(queueId).remove();
                }
            }
        });
    }
}

const PLQueueDirective = function(): ng.IDirective {
    return {
        restrict: 'E',
        scope: true,
        require: ['plQueue', '^plQueueCommunicator'],
        controller: PLQueueController,
        controllerAs: 'plQueueCtrl',
        template: require('./pl-queue.directive.html'),
        link: function link(scope, element, attributes, controllers) {
            const queueNameInput = element.find('.queue-name-edit-input');

            const plQueueCtrl = controllers[0];
            const plQueueCommunicatorCtrl = controllers[1];

            plQueueCommunicatorCtrl.initializeQueueCtrl(plQueueCtrl);

            plQueueCtrl.handleDirectiveInitialize({
                focusOnQueueName: function () {
                    queueNameInput.focus();
                }
            });
        }
    };
};

export default PLQueueController;

import { PLQueueModule } from './pl-queue.module';

PLQueueModule.directive('plQueue', [
    PLQueueDirective
]);

