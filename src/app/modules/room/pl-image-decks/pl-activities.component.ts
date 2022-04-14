import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import {
    PLHttpService,
    PLUrlsService,
} from '@root/index';

import { PLActivityTagsService } from './pl-activity-tags.service';
import { selectCurrentUser } from '@modules/user/store';
import { AppState } from '@app/store';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-activities',
    templateUrl: './pl-activities.component.html',
    styleUrls: ['./pl-activities.component.less'],
})
export class PLActivitiesComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    activities = [];
    filter = {
        title: '',
        tags: [],
        activity_type: '',
        category: '',
    };
    sort = '-count';
    activityToView = null;
    activityToEdit = null;
    currentUser: any = {};
    selectOptsTags: any[] = [];
    selectOptsSort: any[] = [
        { value: '', label: 'Most Relevant' },
        { value: '-date_created', label: 'Newest to Oldest' },
        { value: 'date_created', label: 'Oldest to Newest' },
        { value: '-rating', label: 'Top Rated' },
        { value: '-count', label: 'Most Views' },
    ];
    selectOptsTypes: any[] = [
        { value: '', label: 'All Activity Types' },
        { value: 'youtube', label: 'Video' },
        { value: 'pdfviewer', label: 'Document' },
        { value: 'flashcards', label: 'Flashcard' },
        { value: 'memory', label: 'Memory' },
    ];
    selectOptsCategories: any[] = [
        { value: '', label: 'All' },
        { value: 'favorite', label: 'My Favorites' },
        { value: 'owner', label: 'My Activities' },
    ];
    canLoadMore = 0;
    lastPageNumber = 1;
    loading = 0;

    constructor(
        private store: Store<AppState>,
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
        private plActivityTagsService: PLActivityTagsService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.store.select(selectCurrentUser)
            .subscribe((user) => {
                this.currentUser = user;
            });
        this.getActivities();
        this.getInputOpts();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getInputOpts() {
        const tags = this.plActivityTagsService.getTags();
        this.selectOptsTags = tags.map((tag) => {
            return { value: tag.key, label: tag.label };
        });
    }

    viewActivity(activity) {
        this.activityToView = activity;
        this.activityToEdit = null;
    }

    editActivity(activity) {
        this.activityToEdit = activity;
        this.activityToView = null;
    }

    newActivity() {
        this.activityToView = null;
        this.activityToEdit = {};
    }

    getActivities(evt={}, lastPageNumber=0) {
        if (!this.activityToView && !this.activityToEdit) {
            this.loading = 1;
            this.canLoadMore = 0;
            if (lastPageNumber) {
                this.lastPageNumber = lastPageNumber;
            } else {
                this.lastPageNumber = 1;
            }
            const url = this.plUrls.urls.activity;
            const data: any = {
                exclude_activity_type: 'imageDeck',
                disabled: false,
                page: this.lastPageNumber,
            };
            if (this.sort) {
                data.order_by = this.sort;
            }
            if (this.filter.title) {
                data.q = this.filter.title;
                // If search, force sort to be most relevant.
                if (data.order_by) {
                    delete data.order_by;
                }
            }
            if (this.filter.tags) {
                data.tag = this.filter.tags;
            }
            if (this.filter.activity_type) {
                data.activity_type = this.filter.activity_type;
            }
            if (this.filter.category) {
                if (this.filter.category == 'favorite') {
                    data.facet = 'favorites';
                    data.favorite__user__uuid = this.currentUser.uuid;
                } else if (this.filter.category == 'owner') {
                    data.facet = 'my_activities';
                    data.owner__uuid = this.currentUser.uuid;
                }
            }
            this.plHttp.get('', data, url).subscribe((res: any) => {
                const newActivities = this.formatActivities(res.results);
                if (this.lastPageNumber <= 1) {
                    this.activities = newActivities;
                } else {
                    this.activities = this.activities.concat(newActivities);
                }
                if (this.activities.length < res.count) {
                    this.canLoadMore = 1;
                }
                this.loading = 0;
            });
        }
    }

    loadMore() {
        this.getActivities({}, (this.lastPageNumber + 1));
    }

    toggleFavorite(activity) {
        const url = `${this.plUrls.urls.activity}${activity.id}/favorite/`;
        const data: any = {};
        if (activity.favorite) {
            this.plHttp.delete('', data, url).subscribe((res: any) => {
                activity.favorite = false;
                activity.xClasses.favorite = false;
            });
        } else {
            this.plHttp.save('', data, url).subscribe((res: any) => {
                activity.favorite = true;
                activity.xClasses.favorite = true;
            });
        }
    }

    formatActivities(activities) {
        return activities.map((activity) => {
            return Object.assign(activity, {
                title: activity.name,
                imageUrl: activity.thumbnail_url,
                xClasses: {
                    favorite: activity.favorite,
                },
                mayDelete: this.checkMayDelete(activity),
            });
        });
    }

    checkMayDelete(activity) {
        return (this.currentUser && this.currentUser.username &&
            this.currentUser.username === activity.owner) ? true : false;
    }

    onSaveActivity(evt) {
        this.activityToView = null;
        this.activityToEdit = null;
        this.getActivities();
    }

    onCancelActivity(evt) {
        this.activityToView = null;
        this.activityToEdit = null;
    }
}
