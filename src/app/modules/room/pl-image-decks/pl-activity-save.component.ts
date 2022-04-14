import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import {
    PLHttpService,
    PLUrlsService,
} from '@root/index';
import { selectCurrentUser } from '@modules/user/store';
import { AppState } from '@app/store';
import { User } from '@modules/user/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-activity-save',
    templateUrl: './pl-activity-save.component.html',
    styleUrls: ['./pl-activity-save.component.less'],
})
export class PLActivitySaveComponent implements OnInit, OnChanges, OnDestroy {
    @Input() activity: any = {
        uuid: '',
        id: '',
        title: '',
        description: '',
        imageUrl: '',
        images: [],
        owner: '',
        userFavorite: false,
        tags: [],
        private: true,
        activity_type: '',
        imageDeck: {},
    };
    @Output() onSave = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<any>();

    subscription: Subscription;


    currentUser: User;
    mayDelete = false;
    loading = false;
    choosingImageDeck = true;

    selectOptsType: any[] = [
        { value: 'youtube', label: 'Video' },
        { value: 'pdfviewer', label: 'Document' },
        { value: 'flashcards', label: 'Flashcards' },
        { value: 'memory', label: 'Memory' },
    ];

    constructor(
        private store: Store<AppState>,
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.store.select(selectCurrentUser)
            .subscribe((user) => {
                this.currentUser = user;
                this.checkMayDelete();
            });
        this.formatActivity();
    }

    ngOnChanges(changes) {
        if (changes.activity) {
            this.formatActivity();
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    changeActivityType() {
    }

    onSaveImageDeck(evt) {
    }

    onCancelImageDeck(evt) {
    }

    checkMayDelete() {
        this.mayDelete = (this.currentUser && this.currentUser.username &&
            this.currentUser.username === this.activity.owner);
    }

    formatActivity() {
        const activity = Object.assign({
            title: '',
            imageDeck: {},
        }, this.activity);
        this.activity = activity;
        // Check descriptor for additional data (e.g. imageDeck).
        const descriptor = this.activity.descriptor ? JSON.parse(this.activity.descriptor) : {};
        if (descriptor.imageDeck) {
            this.loadImageDeck(descriptor.imageDeck);
        }
        this.checkMayDelete();
        if (!this.activity.imageDeck.id) {
            this.choosingImageDeck = true;
        }
    }

    loadImageDeck(imageDeck) {
        const url = `${this.plUrls.urls.activity}${imageDeck.id}/`;
        const data = {
            id: imageDeck.id,
        };
        this.plHttp.get('', data, url).subscribe((res: any) => {
            this.activity.imageDeck = Object.assign(res, {
                imageUrl: res.thumbnail_url,
                title: res.name,
            });
            this.choosingImageDeck = false;
        });
    }

    formValid() {
        if (!this.activity.imageDeck || !this.activity.imageDeck.id) {
            return false;
        }
        return true;
    }

    tagsToBackend(tags) {
        const tagUrl = this.plUrls.urls.activityTag;
        const tagsBackend = tags.map((tag) => {
            return { name: tag, _resource_uri: tagUrl };
        });
        return tagsBackend;
    }

    activityToBackend(activity) {
        const imageDeck = activity.imageDeck;
        const descriptor = {
            imageDeck: {
                id: imageDeck.id,
                uuid: imageDeck.uuid,
            },
        };
        const data: any = {
            activity_type: activity.activity_type,
            type: activity.activity_type,
            descriptor: JSON.stringify(descriptor),
            // Not necessary, but for backward compatibility & activity searching (& required fields),
            // just copy over from image deck.
            name: imageDeck.title,
            description: imageDeck.description,
            large_thumbnail_url: imageDeck.imageUrl,
            thumbnail_url: imageDeck.imageUrl,
            tags: this.tagsToBackend(imageDeck.tags),
            images: [],
            private: imageDeck.private,
            shared: !imageDeck.private,
            slug: '',
        };
        return data;
    }

    save() {
        if (!this.formValid()) {
            return;
        }

        this.loading = true;

        const data = this.activityToBackend(this.activity);

        // Backend uses PUT instead of PATCH.
        let isNew = 0;
        if (this.activity.uuid && this.activity.id) {
            data.uuid = this.activity.uuid;
            data.id = this.activity.id;
            const url = `${this.plUrls.urls.activity}${data.id}`;
            this.plHttp.put('', data, url).subscribe((res: any) => {
                this.loading = false;
                this.onSave.emit({});
            }, (err) => {
                this.loading = false;
            });
        } else {
            // Need special id field in addition to uuid, which does not seem to be used.
            if (!this.activity.id) {
                data.id = Math.random().toString(36).substring(7);
                isNew = 1;
            }
            const url = this.plUrls.urls.activity;
            this.plHttp.save('', data, url).subscribe((res: any) => {
                this.loading = false;
                this.onSave.emit({ isNew, activity: res });
            }, (err) => {
                this.loading = false;
            });
        }
    }

    delete() {
        // Soft delete - just set disabled to true.
        if (this.activity.uuid && this.activity.id) {
            const data = this.activityToBackend(this.activity);
            data.uuid = this.activity.uuid;
            data.id = this.activity.id;
            data.disabled = true;
            const url = `${this.plUrls.urls.activity}${data.id}`;
            this.plHttp.put('', data, url).subscribe((res: any) => {
                this.onSave.emit({});
            });
        }
    }

    cancel() {
        this.onCancel.emit({});
    }

    onUseDeck(evt) {
        const deck = evt.deck;
        this.activity.imageDeck = deck;
        this.choosingImageDeck = false;
    }

    toggleChooseImageDeck() {
        this.choosingImageDeck = !this.choosingImageDeck;
    }
}
