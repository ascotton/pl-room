import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GiphyAnimationsService } from '../giphy-animations.service';

@Component({
    selector: 'pl-giphy-search',
    templateUrl: 'giphy-search.component.html',
})

export class GiphySearchComponent implements AfterViewInit {
    @ViewChild('input') input: ElementRef<HTMLInputElement>;
    term: string;

    constructor(
        private giphyAnimationsService: GiphyAnimationsService,
    ) { }

    ngAfterViewInit() {
        this.input.nativeElement.focus();
    }

    search(newTerm: string) {
        this.giphyAnimationsService.search(newTerm);
    }

    clear(ev: Event) {
        ev.preventDefault();
        this.giphyAnimationsService.clearSearch();
        this.term = '';
    }
}
