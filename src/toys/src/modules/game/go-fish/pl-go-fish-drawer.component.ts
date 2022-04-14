import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AngularCommunicatorService } from
    '../../../../../app/downgrade/angular-communicator.service';

import { environment } from '@root/src/environments/environment';

import { AppStore } from '../../../../../app/appstore.model';

import {
    PLHttpService,
    PLUrlsService,
} from '@root/index';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-go-fish-drawer',
    templateUrl: './pl-go-fish-drawer.component.html',
    styleUrls: ['./pl-go-fish-drawer.component.less'],
})
export class PLGoFishDrawerComponent implements OnInit, OnDestroy {
    @Input() activity: any = {};

    newGameCounter = 0;
    cardDisplayOpts = [
        { 'value': 'imageAndText', 'label': 'Image and text' },
        { 'value': 'imageOnly', 'label': 'Image only' },
        { 'value': 'textOnly', 'label': 'Text only' },
    ];
    cardDisplay = 'imageAndText';
    dealCount = 5;
    dealCountOpts = [
        { 'value': 3, 'label': '3 cards per player' },
        { 'value': 5, 'label': '5 cards per player' },
        // { 'value': 7, 'label': '7 cards per player' },
    ];
    viewAllPlayers = 0;
    deck: any = {};
    deckImages: any = [];
    showChooseDeck = false;
    mayEndSelfTurn = 1;
    mayMoveCardsOffTurn = 1;
    theme = {
        backgroundStyles: {
            opacity: 0.5,
        },
        dealerStyles: {
            color: 'black',
        },
        playersStyles: {
            color: 'black',
        },
        cardBackImageUrl: 'https://lightyearassets-cdn.presencelearning.com/f7eb9896-1f12-48a1-9477-89d7e17fe941.png',
    };
    // Rather than using what is set by the deck, allow setting here as override.
    imageCopies = 2;

    fbActivity: any = {};
    subscriptions: Subscription[] = [];

    constructor(
        private angularCommunicator: AngularCommunicatorService,
        private plHttp: PLHttpService,
        private plUrls: PLUrlsService,
        private store: Store<AppStore>,
        private zone: NgZone,
    ) {
        this.subscriptions.push(
            this.store.select('overlaysStore').subscribe((data) => {
                if (!data.activeIFrameWhiteboard) {
                    this.removeListener();
                }
            }),
        );
    }

    ngOnInit() {
        this.initFirebase();
    }

    ngOnDestroy() {
        this.removeListener();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    initFirebase() {
        const fbPath = `activities/queues/items/${this.activity.queueId}/items/${this.activity.activityId}`;
        this.fbActivity = this.angularCommunicator.getFirebaseRef(fbPath);
        this.fbActivity.child('deck').on('value', (ref) => {
            this.zone.run(() => {
                const deck = ref.val();
                if (deck) {
                    this.deck = deck;
                    this.showChooseDeck = false;
                }
            });
        });
        this.fbActivity.child('cards').on('value', (ref) => {
            this.zone.run(() => {
                const deckImages = ref.val();
                if (deckImages) {
                    this.deckImages = deckImages;
                }
            });
        });
        this.fbActivity.child('dealCount').on('value', (ref) => {
            this.zone.run(() => {
                const dealCount = ref.val();
                if (dealCount) {
                    this.dealCount = dealCount;
                }
            });
        });
        this.fbActivity.child('cardDisplay').on('value', (ref) => {
            this.zone.run(() => {
                const cardDisplay = ref.val();
                if (cardDisplay) {
                    this.cardDisplay = cardDisplay;
                }
            });
        });
        this.fbActivity.child('mayEndSelfTurn').on('value', (ref) => {
            this.zone.run(() => {
                const mayEndSelfTurn = ref.val();
                if (mayEndSelfTurn !== undefined) {
                    this.mayEndSelfTurn = mayEndSelfTurn;
                }
            });
        });
        this.fbActivity.child('mayMoveCardsOffTurn').on('value', (ref) => {
            this.zone.run(() => {
                const mayMoveCardsOffTurn = ref.val();
                if (mayMoveCardsOffTurn !== undefined) {
                    this.mayMoveCardsOffTurn = mayMoveCardsOffTurn;
                }
            });
        });
        this.fbActivity.child('theme').on('value', (ref) => {
            this.zone.run(() => {
                const theme = ref.val();
                if (theme) {
                    if (!theme.backgroundStyles) {
                        theme.backgroundStyles = {
                            opacity: 0.5,
                        };
                    }
                    if (!theme.dealerStyles) {
                        theme.dealerStyles = {
                            color: 'black',
                        };
                    }
                    if (!theme.playersStyles) {
                        theme.playersStyles = {
                            color: 'black',
                        };
                    }
                    this.theme = theme;
                }
            });
        });
    }

    newGame() {
        this.newGameCounter++;
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { newGame: this.newGameCounter } });
    }

    changeCardDisplay() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { cardDisplay: this.cardDisplay } });
    }

    changeDealCount() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { dealCount: this.dealCount } });
    }

    changeViewAllPlayers() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { viewAllPlayers: this.viewAllPlayers } });
    }

    changeMayEndSelfTurn() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { mayEndSelfTurn: this.mayEndSelfTurn } });
    }

    changeMayMoveCardsOffTurn() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { mayMoveCardsOffTurn: this.mayMoveCardsOffTurn } });
    }

    changeTheme() {
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { theme: this.theme } });
    }

    chooseDeck() {
        window.addEventListener('message', this.deckMessageListener, false);
        this.store.dispatch({ type: 'UPDATE_OVERLAYS', payload: { activeIFrameWhiteboard: true } });
    }

    cancelChooseDeck(evt) {
        this.showChooseDeck = false;
    }

    getAndUseDeck(deckUuid, deckId) {
        const url = `${this.plUrls.urls.activity}${deckId}/`;
        const data = {
            id: deckId,
        };
        this.plHttp.get('', data, url).subscribe((res: any) => {
            const descriptor = res.descriptor ? JSON.parse(res.descriptor) : {};
            const images = descriptor.images || [];
            const imageDeck = Object.assign(res, {
                imageUrl: res.thumbnail_url,
                title: res.name,
                images: images,
            });
            this.setUseDeck(imageDeck);
        });
    }

    onUseDeck(evt) {
        this.setUseDeck(evt.deck);
    }

    setUseDeck(deck) {
        this.deckImages = this.imagesToCards(deck.images);
        this.deck = deck;
        this.showChooseDeck = false;
        this.fbActivity.child('deck').set({
            uuid: this.deck.uuid,
            id: this.deck.id,
            title: this.deck.title,
            imageUrl: this.deck.imageUrl,
            owner: this.deck.owner,
        });
        this.store.dispatch({ type: 'UPDATE_GAME_GO_FISH', payload: { cards: this.deckImages } });
        this.newGame();
    }

    imagesToCards(deckImages) {
        const cards: any[] = [];
        deckImages.forEach((image) => {
            // for (let ii = 0; ii < image.copies; ii++) {
            for (let ii = 0; ii < this.imageCopies; ii++) {
                cards.push({
                    id: `${image.id}${ii}`,
                    text: image.title,
                    imageUrl: image.thumbnail_url,
                    // sort: image.title,
                });
            }
        });
        return cards;
    }

    private deckMessageListener = (event) => {
        if (!event.origin.includes(`${environment.apps.flutterApp.url}`)) {
            return;
        }
        const data = event.data.data;
        if (data.eventName === 'useDeck' && data.imageDeckUuid && data.imageDeckId) {
            this.removeListener();
            this.getAndUseDeck(data.imageDeckUuid, data.imageDeckId);
            this.store.dispatch({ type: 'UPDATE_OVERLAYS', payload: { activeIFrameWhiteboard: false } });
        }
    }

    private removeListener = () => {
        window.removeEventListener('message', this.deckMessageListener, false);
    }
}
