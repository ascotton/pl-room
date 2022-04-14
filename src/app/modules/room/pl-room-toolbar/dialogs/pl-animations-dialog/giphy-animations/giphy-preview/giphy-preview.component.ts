import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GiphyAnimationsService } from '../giphy-animations.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'pl-giphy-preview',
    templateUrl: 'giphy-preview.component.html',
    styleUrls: ['giphy-preview.component.less'],
})

export class GiphyPreviewComponent {
    showPreview$: Observable<boolean>;
    img$: Observable<string>;

    hasError = false;

    constructor(
        giphyAnimationsService: GiphyAnimationsService,
    ) {
        this.showPreview$ = giphyAnimationsService.selected$.pipe(
            map(selected => !!selected),
        );
        this.img$ = giphyAnimationsService.selected$.pipe(
            map(selected => selected && selected.previewUrl),
        );
    }
}
