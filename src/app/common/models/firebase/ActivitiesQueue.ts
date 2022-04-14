import * as _ from 'lodash';

/**
 * Model that holds the state of the activities
 */
const ActivitiesQueue = function ($timeout, firebaseModel, guidService) {
    function guid() {
        const rhex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        let id = 'XX-X-X-X-XXX';
        id = id.replace(/X/g, rhex);
        return id;
    }

    const getActivityFromSnap = function (snap) {
        const activity = snap.val();
        activity.queueId = snap.key;
        // Backwards compatibility
        // TODO: remove $id.
        activity.$id = activity.queueId;
        return activity;
    };

    const getResourceType = function (activity) {
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
    };

    class ActivitiesQueueModel {
        activities: any[];
        removeQueueUndo: any[];
        removeQueueUndoTimeout: any;
        removeActivityUndo: {};
        index: number;
        ref: any;
        queues: { list: any[]; dictionary: {}; current: number; };
        queuesRef: any;

        constructor() {
            this.activities = [];
            this.removeQueueUndo = [];
            this.removeQueueUndoTimeout = null;
            this.removeActivityUndo = {};

            this.index = -1; // This variable is being assigned from QueueDirective's watcher
            this.ref = firebaseModel.getFirebaseRef('activities/config');

            // this.ref.on('value', this.onActivityChanged.bind(this));
            this.ref.on('child_added', this.onActivityAdded.bind(this));
            this.ref.on('child_moved', this.onActivityMoved.bind(this));
            this.ref.on('child_removed', this.onActivityRemoved.bind(this));
            this.ref.on('child_changed', this.onActivityChanged.bind(this));

            this.queues = { list: [], dictionary: {}, current: -1 };

            this.queuesRef = firebaseModel.getFirebaseRef('queues');
            this.queuesRef.on('value', this.onQueuesChanged.bind(this));
        }

        onActivityChanged(activityRef) {
            const activity = activityRef.val();
            if (activity) {
                const existingActivity = this.activities[this.indexOf(activity)];
                if (existingActivity) {
                    existingActivity.softDeleted = activity.softDeleted;
                }
            }
        }

        indexOf(activity) {
            return _.findIndex(this.activities, (a) => {
                const sameId = a.id === activity.id;
                const sameType = getResourceType(a) === getResourceType(activity);
                const sameQueue = a.queue === activity.queue;

                return sameId && sameType && sameQueue;
            });
        }

        add(activity, index = this.activities.length, queueIndex) {
            if (!activity.id) {
                return;
            }
            const queueId = this.queues.list[_.isUndefined(queueIndex) ? this.index : queueIndex];
            if (!activity.queue) {
                activity.queue = queueId;
            }
            if (this.indexOf(activity) > -1) {
                return this.move(activity, index);
            }
            const activityType = getResourceType(activity);
            const ref = this.ref.child(guidService.generateUUID());
            ref.setWithPriority({
                id: activity.id,
                slug: activity.slug,
                thumbnail_url: activity.thumbnail_url,
                type: activityType === 'game' ? activity.game_type : activity.activity_type,
                activity_type: activityType,
                queue: queueId,
                name: activity.name,
                session_id: guidService.generateUUID() // TODO replace this by whatever mechanism creates the sessions
            }, index);
        }

        move(activity, index, updatePriorities = true) {
            const oldIndex = this.indexOf(activity);
            if (oldIndex === index) {
                return;
            } else if (oldIndex < index) {
                index -= 1;
            }
            this.activities.splice(index, 0, this.activities.splice(oldIndex, 1)[0]);
            if (updatePriorities) {
                this.updatePriorities();
            }
        }

        destroyActivities(...activityIdsToRemove) {
            let index = 0;
            const activitiesToRemove = [];

            const clone = this.activities.slice();

            // grab activities to be deleted
            // and update position for others
            for (let i = 0; i < this.activities.length; i++) {
                const activity = clone[i];

                if (activityIdsToRemove.indexOf(activity.queueId) >= 0) {
                    activitiesToRemove.push(activity);
                    continue;
                }
                const ref = this.ref.child(activity.queueId);
                ref.setPriority(index);
                index++;
            }

            // remove from firebase and splice out of activities array
            // must be done as second step because of weird firebase callbacks
            activitiesToRemove.forEach((activity) => {
                const ref = this.ref.child(activity.queueId);
                const sessionRef = firebaseModel.getFirebaseRef('activities/sessions/' + activity.session_id);
                ref.remove();
                sessionRef.remove();
            });
        }

        remove(...activityIdsToRemove) {
            const activities = this.activities;

            for (let i = 0; i < activities.length; i++) {
                const activity = activities[i];
                if (activityIdsToRemove.indexOf(activity.queueId) >= 0) {
                    this.ref.child(activity.queueId).child('softDeleted').set(true);

                    this.removeActivityUndo[activity.queueId] = $timeout(((activity2, activityId) => {
                        return () => {
                            this.destroyActivities(activityId);
                        };
                    })(activity, activity.queueId), 3000);
                }
            }
        }

        unremove(...activityIdsToRemove) {
            const activities = this.activities;

            for (let i = 0; i < activities.length; i++) {
                const activity = activities[i];
                if (activityIdsToRemove.indexOf(activity.queueId) >= 0) {
                    this.ref.child(activity.queueId).child('softDeleted').set(false);

                    $timeout.cancel(this.removeActivityUndo[activity.queueId]);

                    delete this.removeActivityUndo[activity.queueId];
                }
            }
        }

        removeAll(queueIndex) {
            const activities = this.activities.filter((activity) => activity.queue === this.queues.list[queueIndex]);
            const activityIds = activities.map(activity => activity.queueId);
            this.remove(...activityIds);
        }

        updatePriorities() {
            const priorites = [];
            this.activities.forEach((activity, index) => {
                priorites.push([index, activity.queueId]);
            });
            priorites.forEach((priority) => {
                const ref = this.ref.child(priority[1]);
                ref.setPriority(priority[0]);
            });
        }

        onActivityAdded(snap) {
            const index = snap.getPriority();
            const activity = getActivityFromSnap(snap);

            if (index < this.activities.length) {
                this.activities.splice(index, 0, activity);
            } else {
                this.activities.push(activity);
            }

            if (this.queues.list.length && activity.queue in this.queues.dictionary === false) {
                activity.queue = this.queues.list[0];
            }

            $timeout(function() {}, 0);
        }

        onActivityMoved(snap) {
            const activity = getActivityFromSnap(snap);
            const newIndex = snap.getPriority();
            this.move(activity, newIndex, false);
            $timeout(function() {}, 0);
        }

        onActivityRemoved(snap) {
            const activity = getActivityFromSnap(snap);
            const index = this.activities.findIndex((item) => {
                const sameId = item.id === activity.id;
                const sameType = getResourceType(item) === getResourceType(activity);
                return sameId && sameType;
            });
            this.activities.splice(index, 1);
            $timeout(function() {}, 0);
        }

        queueCount() {
            return this.queues.list.length;
        }

        addQueue(queueName) {
            if (!queueName) {
                let i = 1;

                const list = this.queues.list.map( index => this.queues.dictionary[index]);

                while (list.indexOf('Queue ' + i) >= 0) {
                    i++;
                }

                queueName = 'Queue ' + i;
            }

            const key = guid();

            this.queues.list.unshift(key);
            this.queues.current = 0;
            this.queues.dictionary[key] = queueName;

            this.queuesRef.set(this.queues);
        }

        removeQueue(queueIndex) {
            const queueKey = this.queues.list.splice(queueIndex, 1).pop();
            const queueName = this.queues.dictionary[queueKey];

            this.removeQueueUndo.push({
                queueKey: queueKey,
                queueName: queueName
            });

            if (this.removeQueueUndoTimeout) {
                $timeout.cancel(this.removeQueueUndoTimeout);
            }

            this.removeQueueUndoTimeout = $timeout(() => {
                this.removeQueueUndo.length = 0;
            });

            this.queuesRef.set(this.queues);
        }

        undoRemoveQueue() {
            if (this.removeQueueUndoTimeout) {
                $timeout.cancel(this.removeQueueUndoTimeout);
            }

            const undo = this.removeQueueUndo;

            for (let i = 0; i < undo.length; i++) {
                const item = undo[i];

                this.queues.list.push(item.queueKey);
                this.queues.dictionary[item.queueKey] = item.queueName;
            }

            this.queuesRef.set(this.queues);
        }

        currentQueue(index) {
            this.index = index;
            this.queues.current = index;
            this.queuesRef.set(this.queues);
        }

        onQueuesChanged(queues) {
            let val = queues.val();
            let changed = false;

            // Cleanup
            this.queues.list.length = 0;

            for (const i in this.queues.dictionary) {
                if (this.queues.dictionary.hasOwnProperty(i)) {
                    delete this.queues.dictionary[i];
                }
            }

            val = val || ((changed = true) && {});
            val.list = val.list || ((changed = true) && []);
            val.current = val.current || ((changed = true) && 0);
            val.dictionary = val.dictionary || ((changed = true) && {});

            if (val.list.length === 0) {
                const id = guid();
                val.list.push(id);
                val.dictionary[id] = 'Queue 1';
            }

            this.queues.current = this.index = val.current;
            this.queues.list.push.apply(this.queues.list, val.list);

            for (let i = 0; i < val.list.length; i++) {
                let key = val.list[i];
                let value = val.dictionary[val.list[i]];

                if (value === undefined) { // We are working with old data format. Lets convert it to new one...
                    value = key;
                    key = i;

                    val.list[i] = i; // Backward compatibility requirement with non-draggable version
                    val.dictionary[key] = value;

                    changed = true;
                }

                this.queues.list[i] = val.list[i];
                this.queues.dictionary[key] = value;
            }

            for (let i = 0; i < this.activities.length; i++) {
                const activity = this.activities[i];

                if (activity.queue in this.queues.dictionary === false) {
                    activity.queue = this.queues.list[0];
                    changed = true;
                }
            }

            if (changed) {
                this.queuesRef.set(this.queues);
            }

            $timeout(function () {});
        }

        contains(activity) {
            if (!activity) {
                return false;
            }
            const index = this.indexOf(activity);
            if (index < 0) {
                return false;
            } else {
                return true;
            }
        }
    }
    return new ActivitiesQueueModel();
};

import { commonModelsModule } from '../models.module';
commonModelsModule.service('activitiesQueue',
    ['$timeout', 'firebaseModel', 'guidService', ActivitiesQueue]
);
