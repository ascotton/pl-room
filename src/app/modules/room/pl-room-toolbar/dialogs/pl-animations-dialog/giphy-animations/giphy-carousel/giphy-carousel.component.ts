import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GiphyAnimationsService } from '../giphy-animations.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'pl-giphy-carousel',
    templateUrl: 'giphy-carousel.component.html',
    styleUrls: ['giphy-carousel.component.less'],
})

export class GiphyCarouselComponent {
    disablePrev$: Observable<boolean>;
    disableNext$: Observable<boolean>;

    constructor(
        private giphyAnimationsService: GiphyAnimationsService,
    ) {
        this.disablePrev$ = this.giphyAnimationsService.hasPrev$.pipe(
            map(hasPrev => !hasPrev),
        );
        this.disableNext$ = this.giphyAnimationsService.hasNext$.pipe(
            map(hasNext => !hasNext),
        );
    }

    prev() {
        this.giphyAnimationsService.prev();
    }

    next() {
        this.giphyAnimationsService.next();
    }
}
