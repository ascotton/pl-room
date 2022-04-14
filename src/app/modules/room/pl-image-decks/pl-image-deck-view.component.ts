import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectCurrentUser } from '@modules/user/store';
import { AppState } from '@app/store';
import { User } from '@modules/user/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-image-deck-view',
    templateUrl: './pl-image-deck-view.component.html',
    styleUrls: ['./pl-image-deck-view.component.less']
})
export class PLImageDeckViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() deck: any = {
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

    @Output() onCancel = new EventEmitter<any>();

    subscription: Subscription;

    currentUser: User;
    showMoreFields = true;

    constructor(
        private store: Store<AppState>,
    ) {
    }

    ngOnInit() {
        this.subscription = this.store.select(selectCurrentUser)
            .subscribe((user) => {
                this.currentUser = user;
            });
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

    tagsToString(tags) {
        const tagNames = tags.map((tag) => {
            return tag.name;
        });
        return tagNames.join(', ');
    }

    formatDeck() {
        this.deck = Object.assign({
            title: '',
            imageUrl: '',
            images: [],
            owner: '',
            userFavorite: false,
            tags: [],
            xTagsString: this.tagsToString(this.deck.tags),
        }, this.deck);
        console.log('deck', this.deck);
    }

    cancel() {
        this.onCancel.emit({});
    }
}
