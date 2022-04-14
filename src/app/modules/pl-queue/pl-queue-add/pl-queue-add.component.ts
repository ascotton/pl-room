import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { PLHttpService, PLUrlsService } from '@root/index';

import { AngularCommunicatorService } from
    '@app/downgrade/angular-communicator.service';
import { selectCurrentUser } from '@modules/user/store';
import { AppState } from '@app/store';

import { Subscription } from 'rxjs';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { User } from '../../user/user.model';
@Component({
    selector: 'pl-queue-add',
    templateUrl: './pl-queue-add.component.html',
    styleUrls: ['./pl-queue-add.component.less'],
})
export class PLQueueAddComponent implements OnInit, OnDestroy {
    private readonly OFFICIAL_SECTION = 'pldrl';
    private readonly COMMUNITY_SECTION = 'ugc';
    private readonly MY_ACTIVITIES_SECTION = 'own';
    private user: any;
    private subscription: Subscription;
    @ViewChild('quickYoutube', { static: false }) quickYoutube;

    filterOpts: any = {
        activitySection: this.OFFICIAL_SECTION,
        activityType: 'all',
        search: '',
    };

    defaultSelectOptsTypes: any[] = [
        { value: 'all', label: 'All Activity Types' },
        { value: 'youtube', label: 'Video' },
        { value: 'pdfviewer', label: 'Document' },
        { value: 'flashcards', label: 'Flashcard' },
        { value: 'memory', label: 'Memory' },
        // { value: 'assessment', label: 'Assessment' },
        // { value: 'game', label: 'Game' },
    ];
    assessmentOpt = { value: 'assessment', label: 'Assessment' };
    gameOpt = { value: 'game', label: 'Game' };

    selectOptsTypes: any[] = this.defaultSelectOptsTypes;

    selectOptsSections: any[] = [
        { value: this.OFFICIAL_SECTION, label: 'PL Library' },
        { value: this.MY_ACTIVITIES_SECTION, label: 'My Activities' },
    ];

    items: any[] = [];
    loading = false;
    blockGetItems = false;

    queuesRef: any;
    queueItemsById: any = {};
    currentQueueId = '';
    queueName = '';
    libraryUrl = '';

    activityBase = {
        age_level_max: 8,
        age_level_min: -1,
        disabled: false,
        favorite: false,
    };

    showActivities = false;
    private communitySectionOption = { value: this.COMMUNITY_SECTION, label: 'Community' };

    constructor(
        public angularCommunicator: AngularCommunicatorService,
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
        private store: Store<AppState>,
        private currentUser: CurrentUserModel,
    ) {
    }

    private isOnlyAssessmentsUser(user) {
        return (user.groups.indexOf('School Staff Providers') >= 0 || user.groups.indexOf('Private Practice') >= 0)
                && user.groups.indexOf('Assessment Users')
                && user.groups.indexOf('Activity Users') === -1;
    }

    ngOnInit() {
        const name = 'activities/queues';
        const path = `${this.angularCommunicator.roomname}/${name}`;
        this.queuesRef = firebase.database().ref(path);
        this.libraryUrl = this.plUrls.urls.libraryFE;

        this.subscription = this.store.select(selectCurrentUser)
        .subscribe((user) => {
            if (user && user.groups) {
                this.user = user;
                // Show community option
                if (!this.isOnlyAssessmentsUser(user) && this.hasCommunitySectionAccess(user)) {
                    this.selectOptsSections.splice(1, 0, this.communitySectionOption);
                }

                this.setActivityTypesOptions();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getQueueItems() {
        const queueId = this.angularCommunicator.activeQueueId;
        // if (queueId && (!this.currentQueueId || this.currentQueueId !== queueId)) {
        if (queueId) {
            this.queueItemsById = {};
            // Get existing queue items to pre-select them in search results if already in queue.
            const pathItems = `${this.angularCommunicator.roomname}/activities/queues/items/${queueId}`;
            const queueRef = firebase.database().ref(pathItems);
            queueRef.once('value', (ref) => {
                const queue = ref.val();
                this.queueName = queue.name;
                const queueItems = {};
                for (const key in queue.items) {
                    // Use a hash for quick look up.
                    queueItems[queue.items[key].id] = {
                        id: queue.items[key].id,
                        activityId: queue.items[key].activityId,
                    };
                }
                this.queueItemsById = queueItems;
                this.currentQueueId = queueId;
            });
        }
    }

    youtubeQuickstart() {
        this.quickYoutube.open();
    }

    getItems(evt: any = {}) {
        this.getQueueItems();
        if (!this.blockGetItems) {
            this.loading = true;
            const urlBase = `${this.plUrls.urls.platformFE}/api/v1/`;
            let url = `${urlBase}activity/`;
            const params: any = {
                disabled: false,
                private: false,
                facet: 'all',
                section: this.OFFICIAL_SECTION,
            };
            if (this.filterOpts.activitySection) {
                if (this.filterOpts.activitySection === this.MY_ACTIVITIES_SECTION) {
                    params.private = true;
                    params.section = this.COMMUNITY_SECTION;
                    params.owner__uuid = this.currentUser.user.uuid;
                } else {
                    params.section = this.filterOpts.activitySection;
                }
            }
            if (this.filterOpts.activityType && this.filterOpts.activityType !== 'all') {
                if (this.filterOpts.activityType === 'assessment') {
                    url = `${urlBase}assessment/`;
                } else if (this.filterOpts.activityType === 'game') {
                    url = `${urlBase}game/`;
                } else {
                    params.activity_type = this.filterOpts.activityType;
                }
            }
            if (this.filterOpts.search) {
                params.q = this.filterOpts.search;
            }
            // Filter out image decks and record forms.
            params.exclude_activity_type = 'imageDeck,recordform';
            this.plHttp.get('', params, url).subscribe((data: any) => {
                const items = data.results;
                items.forEach((item: any) => {
                    if (item.id in this.queueItemsById) {
                        item.xAdded = true;
                        item.xClasses = 'added';
                        item.xActivityId = this.queueItemsById[item.id].activityId;
                    } else {
                        item.xAdded = false;
                        item.xClasses = '';
                        item.xActivityId = '';
                    }
                    item.xOverlayText = '';
                    item.xImgStyles = {
                        'background-image': `url(${item.thumbnail_url})`,
                    };
                });
                this.items = items;

                this.loading = false;
            });
        }
    }

    // Copied from pl-queue.directive; not sure why it is so complex.
    getResourceType(activity) {
        let isAssessment: boolean;
        let isGame: boolean;
        let type = 'activity';
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

    // Copied from ng1
    generateUUID() {
        let d = Date.now();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    addOrRemoveItem(item, index) {
        // If were in the text box then click an item, this will also trigger
        // a "blur" event to be fired to re-get items. We want to block that.
        // Set the timeout to just over the blur debounce of 1000.
        this.blockGetItems = true;
        setTimeout(
            () => {
                this.blockGetItems = false;
            },
            1100);

        if (item.xAdded) {
            this.removeItem(item, index);
        } else {
            this.addItem(item, index);
        }
    }

    removeItem(item, index) {
        const queueId = this.angularCommunicator.activeQueueId;

        const name = 'activities/queues';
        const path = `${this.angularCommunicator.roomname}/activities/queues/items/${queueId}`;
        const queueRef = firebase.database().ref(path);
        queueRef.once('value', (ref) => {
            queueRef.child('items').child(item.xActivityId).remove();

            // Need to remove from order as well.
            const queue = ref.val();
            const queueOrder = queue.order.filter((activityId) => {
                return activityId !== item.xActivityId ? true : false;
            });
            queueRef.child('order').set(queueOrder);
        });

        item.xAdded = false;
        item.xClasses = '';
        item.xActivityId = '';
        item.xOverlayText = 'Removed from queue';
        setTimeout(
            () => {
                item.xOverlayText = '';
            },
            2000);
    }

    addItem(item, index) {
        const queueId = this.angularCommunicator.activeQueueId;
        const activityId = this.generateUUID();
        const activityType = this.getResourceType(item);
        const activity = {
            queueId,
            activityId,
            id: item.id,
            slug: item.slug,
            thumbnail_url: item.thumbnail_url,
            type: item.game_type ? item.game_type : item.activity_type,
            activity_type: activityType,
            name: item.name,
            session_id: this.generateUUID(),
        };
        this.queuesRef.child('items').child(queueId).child('items').child(activityId).set(activity);

        // Need to add to order as well, otherwise they will not show up.
        const name = 'activities/queues';
        const path = `${this.angularCommunicator.roomname}/activities/queues/items/${queueId}`;
        const queueRef = firebase.database().ref(path);
        queueRef.child('order').once('value', (ref) => {
            let queueOrder = ref.val();
            if (!queueOrder || !queueOrder.length) {
                queueOrder = [];
            }
            queueOrder.push(activityId);
            queueRef.child('order').set(queueOrder);
        });

        // Remove item from results.
        // this.items.splice(index, 1);
        item.xAdded = true;
        item.xClasses = 'added';
        // Required for removing activity.
        item.xActivityId = activityId;
        item.xOverlayText = 'Added to queue';
        setTimeout(
            () => {
                item.xOverlayText = '';
            },
            2000);
    }

    done() {
        this.blockGetItems = true;
        // Just like addOrRemoveItem block - set to just above the 1000 blur debounce.
        setTimeout(
            () => {
                this.blockGetItems = false;
            },
            1100);
        // Reset items (for next time).
        this.items = [];
        this.angularCommunicator.queueAddDone = true;
        this.filterOpts.activitySection = this.OFFICIAL_SECTION;
        this.filterOpts.activityType = 'all';
        this.filterOpts.search = '';
    }

    toggleShowActivities() {
        this.showActivities = !this.showActivities;
    }

    setActivityTypesOptions() {
        const user = this.user;
        const defaultSelectOptsTypes = [ ...this.defaultSelectOptsTypes ];
        const isOfficialSectionSelected = this.filterOpts.activitySection === this.OFFICIAL_SECTION;
        if (user && user.groups) {
            let availableOptions = [];
            if (isOfficialSectionSelected) {
                defaultSelectOptsTypes.push(this.gameOpt);
            } else if (this.filterOpts.activityType === 'game' || this.filterOpts.activityType === 'assessment') {
                this.filterOpts.activityType = 'all';
            }
            if (user.groups.indexOf('School Staff Providers') >= 0 ||
                user.groups.indexOf('Private Practice') >= 0) {
                if (user.groups.indexOf('Activity Users') >= 0 && user.groups.indexOf('Assessment Users') >= 0) {
                    availableOptions = defaultSelectOptsTypes;
                    if (isOfficialSectionSelected) {
                        availableOptions.push(this.assessmentOpt);
                    }
                } else if (user.groups.indexOf('Activity Users') >= 0) {
                    availableOptions = defaultSelectOptsTypes;
                } else if (user.groups.indexOf('Assessment Users') >= 0 && isOfficialSectionSelected) {
                    this.filterOpts.activityType = 'assessment';
                    availableOptions = [this.assessmentOpt];
                }
            } else if (user.groups.indexOf('Provider') >= 0 ||  user.groups.indexOf('Therapist') >= 0) {
                availableOptions = defaultSelectOptsTypes;
                if (isOfficialSectionSelected) {
                    availableOptions.push(this.assessmentOpt);
                }
            }
            this.selectOptsTypes = availableOptions;
            this.getItems();
        }
    }

    private hasCommunitySectionAccess(user: User) {
        const isCommunityLibraryAccess = user.groups.indexOf('Community Library Access') > -1;
        return isCommunityLibraryAccess;
    }
}
