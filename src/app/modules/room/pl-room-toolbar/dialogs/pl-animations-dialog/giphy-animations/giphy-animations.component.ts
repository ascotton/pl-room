import { Component, OnInit, OnDestroy } from '@angular/core';
import { GiphyAnimationsService } from './giphy-animations.service';
import { Observable } from 'rxjs';
import { RewardAnimationsService } from '@modules/reward-animations/reward-animations.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'pl-giphy-animations',
    templateUrl: 'giphy-animations.component.html',
    styleUrls: ['giphy-animations.component.less'],
    providers: [
        GiphyAnimationsService,
    ],
})

export class GiphyAnimationsComponent implements OnInit, OnDestroy {
    showContent$: Observable<boolean>;
    url$: Observable<string>;
    playing$: Observable<boolean>;
    message: string;

    constructor(
        private rewardAnimationsService: RewardAnimationsService,
        private giphyAnimationsService: GiphyAnimationsService,
    ) {
        this.showContent$ = giphyAnimationsService.hasGifs$;
        this.url$ = giphyAnimationsService.selected$.pipe(
            map(selected => selected && selected.url),
        );
        this.playing$ = rewardAnimationsService.queuedAnimation$.pipe(
            map(queuedAnimation => !!queuedAnimation),
        );
    }

    ngOnInit() {
        this.giphyAnimationsService.onInit();
    }

    ngOnDestroy() {
        this.giphyAnimationsService.onDestroy();
    }

    play(url: string, message: string) {
        this.rewardAnimationsService.queueGiphyAnimation(url, message);
    }
}
