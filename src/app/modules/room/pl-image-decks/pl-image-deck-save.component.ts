import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { PLImageSaveService } from './pl-image-save.service';
import { PLActivityTagsService } from './pl-activity-tags.service';

import {
    PLHttpService,
    PLUrlsService,
    PLLodashService,
} from '@root/index';
import { selectCurrentUser } from '@modules/user/store';
import { AppState } from '@app/store';
import { User } from '@modules/user/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-image-deck-save',
    templateUrl: './pl-image-deck-save.component.html',
    styleUrls: ['./pl-image-deck-save.component.less']
})
export class PLImageDeckSaveComponent implements OnInit, OnChanges, OnDestroy {
    @Input() deck = {
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
        // Just the opposite of private? So redundant?
        // shared: false,
    };

    @Input() showSave = 1;
    @Input() showImages = 1;

    @Output() onSave = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<any>();

    subscription: Subscription;

    currentUser: User;
    mayDelete = false;
    copiesDefault = 1;
    loading = false;
    showMoreFields = true;

    selectOptsTags: any = {
        grade: [],
        slt: [],
        ot: [],
        bmh: [],
        sped: [],
    };
    models = {
        tags: {
            grade: [],
            slt: [],
            ot: [],
            bmh: [],
            sped: [],
            custom: [],
        },
        customTagText: '',
    };

    constructor(
        private store: Store<AppState>,
        private plLodash: PLLodashService,
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
        private plImageSaveService: PLImageSaveService,
        private plActivityTagsService: PLActivityTagsService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.store.select(selectCurrentUser)
            .subscribe((user) => {
                this.currentUser = user;
                this.checkMayDelete();
            });
        this.getInputOpts();
        this.formatDeck();
    }

    ngOnChanges(changes) {
        if (changes.deck) {
            this.formatDeck();
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    toggleMoreFields() {
        this.showMoreFields = !this.showMoreFields;
    }

    getInputOpts() {
        const keys = ['grade', 'slt', 'ot', 'bmh', 'sped'];
        keys.forEach((key) => {
            let tags = this.plActivityTagsService.getTags(key);
            this.selectOptsTags[key] = tags.map((tag) => {
                return { value: tag.key, label: tag.label };
            });
        });
    }

    selectTags(type) {
    }

    addCustomTag() {
        const tagString = this.models.customTagText;
        if (tagString) {
            const tags = tagString.split(' ');
            tags.forEach((tag) => {
                let tagFormatted = tag.toLowerCase().trim();
                if (tagFormatted.length && !this.models.tags.custom.includes(tagFormatted)) {
                    this.models.tags.custom.push(tagFormatted);
                }
            });
        }
        this.models.customTagText = '';
    }

    removeCustomTag(tag) {
        const index = this.models.tags.custom.indexOf(tag);
        if (index > -1) {
            this.models.tags.custom.splice(index, 1);
        }
    }

    combineTags() {
        const tags = [];
        const modelKeys = ['grade', 'slt', 'ot', 'bmh', 'sped', 'custom'];
        modelKeys.forEach((modelKey) => {
            let modelTags = this.models.tags[modelKey];
            modelTags.forEach((tag) => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        });
        return tags;
    }

    resetTags() {
        const modelKeys = ['grade', 'slt', 'ot', 'bmh', 'sped', 'custom'];
        modelKeys.forEach((modelKey) => {
            this.models.tags[modelKey] = [];
        });
    }

    // Take the tags from the backend and pre-select them in the input models.
    breakTagsIntoCategories(tags) {
        this.resetTags();
        const keys = ['grade', 'slt', 'ot', 'bmh', 'sped'];
        tags.forEach((tagObj) => {
            let tag = tagObj.name;
            let found = 0;
            keys.forEach((key) => {
                let index = this.plLodash.findIndex(this.selectOptsTags[key], 'value', tag);
                if (index > -1) {
                    this.models.tags[key].push(tag);
                    found = 1;
                }
            });
            // If not a preset, it is a custom tag.
            if (!found) {
                this.models.tags.custom.push(tag);
            }
        });
    }

    checkMayDelete() {
        this.mayDelete = (this.currentUser && this.currentUser.username &&
            this.currentUser.username === this.deck.owner) ? true : false;
    }

    formatDeck() {
        this.deck = Object.assign({
            title: '',
            imageUrl: '',
            images: [],
            owner: '',
            userFavorite: false,
            tags: [],
        }, this.deck);
        this.breakTagsIntoCategories(this.deck.tags);
        this.checkMayDelete();
    }

    formValid() {
        if (!this.deck.title || !this.deck.imageUrl || !this.deck.images.length) {
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

    deckToBackend(deck) {
        this.deck.tags = this.combineTags();
        // The descriptor field is where we hold all the image info as a big JSON string.
        const descriptor = {
            'images': this.deck.images,
        };
        const data: any = {
            name: this.deck.title,
            description: this.deck.description,
            large_thumbnail_url: this.deck.imageUrl,
            thumbnail_url: this.deck.imageUrl,
            tags: this.tagsToBackend(this.deck.tags),
            images: this.deck.images,
            activity_type: 'imageDeck',
            type: 'imageDeck',
            private: this.deck.private,
            shared: !this.deck.private,
            descriptor: JSON.stringify(descriptor),
            slug: '',
        };
        return data;
    }

    save() {
        if (!this.formValid()) {
            return;
        }

        this.loading = true;
        const imgEle = document.querySelector('.pl-image-deck-save img.image');
        this.plImageSaveService.save(this.deck.imageUrl, this.deck.title, '', imgEle).subscribe((res: any) => {
            this.deck.imageUrl = res.url;

            const data = this.deckToBackend(this.deck);

            // Backend uses PUT instead of PATCH.
            let isNew = 0;
            if (this.deck.uuid && this.deck.id) {
                data.uuid = this.deck.uuid;
                data.id = this.deck.id;
                const url = `${this.plUrls.urls.activity}${data.id}`;
                this.plHttp.put('', data, url).subscribe((res: any) => {
                    this.loading = false;
                    this.onSave.emit({});
                }, (err) => {
                    this.loading = false;
                });
            } else {
                // Need special id field in addition to uuid, which does not seem to be used.
                if (!this.deck.id) {
                    data.id = Math.random().toString(36).substring(7);
                    isNew = 1;
                }
                const url = this.plUrls.urls.activity;
                this.plHttp.save('', data, url).subscribe((res: any) => {
                    this.loading = false;
                    this.onSave.emit({ isNew, deck: res });
                }, (err) => {
                    this.loading = false;
                });
            }
        });
    }

    delete() {
        // Soft delete - just set disabled to true.
        if (this.deck.uuid && this.deck.id) {
            const data = this.deckToBackend(this.deck);
            data.uuid = this.deck.uuid;
            data.id = this.deck.id;
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

    removeImageFromDeck(image) {
        const index = this.plLodash.findIndex(this.deck.images, 'id', image.id);
        if (index > -1) {
            this.deck.images.splice(index, 1);
        }
    }

    onSaveImage(evt) {
        this.deck.images.push(Object.assign(evt.imageData, {
            copies: this.copiesDefault,
        }));
    }

}
