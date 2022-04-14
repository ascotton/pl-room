import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { PLImageDeckImage } from '../../pl-image-decks/image-decks.model';
import { PLFlashcardsWidgetService } from '../pl-flashcards-widget/pl-flashcards-widget.service';
import { PLFlashcardsWidgetParams } from '../pl-widget.model';

@Component({
    selector: 'pl-flashcards-widget',
    templateUrl: 'flashcards-widget.component.html',
    styleUrls: ['./flashcards-widget.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLFlashcardsWidgetComponent implements OnInit, OnChanges {
    @Input() public dragging = false;
    @Input() public params: PLFlashcardsWidgetParams;
    @Input() public id: string;
    @Output() readonly changed: EventEmitter<void> = new EventEmitter();

    deckUuid: string;
    cards: PLImageDeckImage[] = [];
    drawnCards = 0;
    private animatingCards: any = {};
    constructor(private currentUser: CurrentUserModel,
                private flashCardsService: PLFlashcardsWidgetService) {
    }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.params) {
            if (this.deckUuid !== this.params.deckUuid) {
                this.deckUuid = this.params.deckUuid;
                this.cards = this.params.cards;
                this.changed.emit();
            }
            this.drawnCards = this.params.drawnCards;
        }
    }

    getCardZIndex(i) {
        return this.isCardDrawn(i) ? (this.cards.length - i) : 1;
    }

    getCardMargin(index: number) {
        const maxMargin = 6;
        const margin = (maxMargin / this.cards.length) * index;
        return margin;
    }

    drawCard(i) {
        let cardIndex = this.cards.length - this.drawnCards;
        if (this.isCardDrawn(i)) {
            this.drawnCards--;
        } else {
            cardIndex--;
            this.drawnCards++;
        }
        this.params.drawnCards = this.drawnCards;
        this.changed.emit();
        this.animatingCards[cardIndex] = true;
        setTimeout(() => this.animatingCards[cardIndex] = false, 600);
    }

    isCardDrawn(i) {
        return (this.cards.length - 1 - i)  < this.drawnCards;
    }

    isCardAnimating(i) {
        return !!this.animatingCards[i];
    }

    onRestack() {
        this.params.drawnCards = 0;
        this.changed.emit();
    }

    get isProvider() {
        return this.currentUser.user.isClinicianOrExternalProvider();
    }
}
