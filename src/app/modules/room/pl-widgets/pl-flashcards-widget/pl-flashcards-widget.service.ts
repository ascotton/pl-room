import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PLWidget } from '../pl-widget.model';

@Injectable()
export class PLFlashcardsWidgetService {
    private openCardSelectionSource = new BehaviorSubject<string>('');
    openCardSelection$ = this.openCardSelectionSource.asObservable();

    config: PLWidget = {
        type: 'flashcards-widget',
        name: 'Flashcards',
        icon: 'cards',
        iconScale: 1.4,
        params: {
        },
        settings: [1],
        clicked: false,
        top_x: 0,
        top_y: 0,
        initial_top_x: 0,
        initial_top_y: 0,
        initial_width: 0,
        actions: {},
        opacity: 0,
        scaled: false,
        added: false,
        zIndex: -1,
        hidden: false,
    };
    constructor() { }

    openDeckSelection(id) {
        this.openCardSelectionSource.next(id);
    }

}
