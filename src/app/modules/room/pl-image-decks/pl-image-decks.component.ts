import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import {
    PLHttpService,
    PLUrlsService,
} from '@root/index';

import { PLActivityTagsService } from './pl-activity-tags.service';
import { AppState } from '@app/store';
import { selectCurrentUser } from '@modules/user/store';
import { User } from '@modules/user/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-image-decks',
    templateUrl: './pl-image-decks.component.html',
    styleUrls: ['./pl-image-decks.component.less'],
})
export class PLImageDecksComponent implements OnInit, OnDestroy {
    @Input() showCancel = 1;

    @Output() onUseDeck = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<any>();

    subscription: Subscription;

    decks = [];

    filter = {
        title: '',
        tags: [],
        category: '',
    };
    sort = '-count';

    selectOptsTags: any[] = [];
    selectOptsSort: any[] = [
        { value: '', label: 'Most Relevant' },
        // { value: '-date_created', label: 'Newest to Oldest' },
        // { value: 'date_created', label: 'Oldest to Newest' },
        // { value: '-rating', label: 'Top Rated' },
        { value: '-count', label: 'Most Views' },
    ];
    selectOptsCategories: any[] = [
        { value: '', label: 'All' },
        { value: 'favorite', label: 'My Favorites' },
        { value: 'owner', label: 'My Activities' },
    ];
    canLoadMore = 0;
    lastPageNumber = 1;
    loading = 0;

    deckToView = null;
    deckToEdit = null;
    currentUser: User;

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
        this.getDecks();
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

    useDeck(deck) {
        const url = `${this.plUrls.urls.activity}${deck.id}/use/`;
        const data: any = {};
        this.plHttp.put('', data, url).subscribe((res: any) => {
            // Nothing to do, just updating backend.
        });
        this.onUseDeck.emit({ deck });
    }

    cancel() {
        this.onCancel.emit({});
    }

    viewDeck(deck) {
        this.deckToView = deck;
        this.deckToEdit = null;
    }

    editDeck(deck) {
        this.deckToEdit = deck;
        this.deckToView = null;
    }

    newDeck() {
        this.deckToView = null;
        this.deckToEdit = {};
    }

    getDecks(evt={}, lastPageNumber=0) {
        if (!this.deckToView && !this.deckToEdit) {
            this.loading = 1;
            this.canLoadMore = 0;
            if (lastPageNumber) {
                this.lastPageNumber = lastPageNumber;
            } else {
                this.lastPageNumber = 1;
            }
            const url = this.plUrls.urls.activity;
            const data: any = {
                activity_type: 'imageDeck',
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
                const newDecks = this.formatDecks(res.results);
                if (this.lastPageNumber <= 1) {
                    this.decks = newDecks;
                } else {
                    this.decks = this.decks.concat(newDecks);
                }
                if (this.decks.length < res.count) {
                    this.canLoadMore = 1;
                }
                this.loading = 0;
            });
        }
    }

    loadMore() {
        this.getDecks({}, (this.lastPageNumber + 1));
    }

    toggleFavorite(deck) {
        const url = `${this.plUrls.urls.activity}${deck.id}/favorite/`;
        const data: any = {};
        if (deck.favorite) {
            this.plHttp.delete('', data, url).subscribe((res: any) => {
                deck.favorite = false;
                deck.xClasses.favorite = false;
            });
        } else {
            this.plHttp.save('', data, url).subscribe((res: any) => {
                deck.favorite = true;
                deck.xClasses.favorite = true;
            });
        }
    }

    formatDecks(decks) {
        return decks.map((deck) => {
            const descriptor = deck.descriptor ? JSON.parse(deck.descriptor) : {};
            const images = descriptor.images || [];
            return {
                uuid: deck.uuid,
                id: deck.id,
                title: deck.name,
                imageUrl: deck.thumbnail_url,
                tags: deck.tags,
                images: images,
                owner: deck.owner,
                private: deck.private,
                description: deck.description,
                favorite: deck.favorite,
                xClasses: {
                    favorite: deck.favorite,
                },
                imageCopyCount: this.countImageCopies(images),
                mayDelete: this.checkMayDelete(deck),
            };
        });
    }

    checkMayDelete(deck) {
        return (this.currentUser && this.currentUser.username &&
            this.currentUser.username === deck.owner) ? true : false;
    }

    countImageCopies(images) {
        let count = 0;
        images.forEach((image) => {
            count += parseInt(image.copies, 10);
        });
        return count;
    }

    onSaveImageDeck(evt) {
        // If new, auto favorite it for the user.
        if (evt.isNew) {
            const url = `${this.plUrls.urls.activity}${evt.deck.id}/favorite/`;
            const data: any = {};
            this.plHttp.save('', data, url).subscribe((res: any) => {
                this.deckToView = null;
                this.deckToEdit = null;
                this.getDecks();
            });
        } else {
            this.deckToView = null;
            this.deckToEdit = null;
            this.getDecks();
        }
    }

    onCancelImageDeck(evt) {
        this.deckToView = null;
        this.deckToEdit = null;
    }

}
