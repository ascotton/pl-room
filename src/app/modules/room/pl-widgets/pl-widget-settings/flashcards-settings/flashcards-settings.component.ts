import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '@root/src/app/appstore.model';
import { environment } from '@root/src/environments/environment';
import { Subscription } from 'rxjs';

import { PLImageDecksGetService } from '@room/pl-image-decks/image-decks-get.service';
import { PLImageDeck } from '@room/pl-image-decks/image-decks.model';
import { PLFlashcardsWidgetService } from '../../pl-flashcards-widget/pl-flashcards-widget.service';
import { PLFlashcardsWidgetParams } from '../../pl-widget.model';
@Component({
    selector: 'pl-flashcards-settings',
    templateUrl: 'flashcards-settings.component.html',
    styleUrls: ['./flashcards-settings.component.less'],
})
export class PLFlashcardsSettingsComponent implements OnInit, OnDestroy {
    @Input() public id: string;
    @Output() readonly paramsModelChange: EventEmitter<PLFlashcardsWidgetParams> =
        new EventEmitter<PLFlashcardsWidgetParams>();
    private subscriptions: Subscription[] = [];
    constructor(private store: Store<AppStore>,
                private imageDeckService: PLImageDecksGetService,
                private flashCardsService: PLFlashcardsWidgetService) {
        this.subscriptions.push(
            this.store.select('overlaysStore').subscribe((data) => {
                if (!data.activeIFrameWhiteboard) {
                    this.removeListener();
                }
            }),
            this.flashCardsService.openCardSelection$.subscribe((id) => {
                if (id === this.id) {
                    this.onChooseCards();
                }
            }),
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.removeListener();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    onChooseCards() {
        window.addEventListener('message', this.deckMessageListener, false);
        this.store.dispatch({ type: 'UPDATE_OVERLAYS', payload: { activeIFrameWhiteboard: true } });
    }

    private deckMessageListener = (event) => {
        if (!event.origin.includes(`${environment.apps.flutterApp.url}`)) {
            return;
        }
        const data = event.data.data;
        if (data.eventName === 'useDeck' && data.imageDeckId) {
            this.removeListener();
            this.subscriptions.push(
                this.imageDeckService.getDeck(data.imageDeckId).subscribe((deck: PLImageDeck) => {
                    this.store.dispatch({ type: 'UPDATE_OVERLAYS', payload: { activeIFrameWhiteboard: false } });
                    const params: PLFlashcardsWidgetParams = {
                        deckUuid: deck.uuid,
                        cards: deck.images,
                        drawnCards: 0,
                    };
                    this.paramsModelChange.emit(params);
                }),
            );
        }
    }

    private removeListener = () => {
        window.removeEventListener('message', this.deckMessageListener, false);
    }

}
