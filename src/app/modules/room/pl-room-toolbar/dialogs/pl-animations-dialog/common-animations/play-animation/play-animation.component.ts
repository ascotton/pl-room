import { Component, Input, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { RewardAnimationsService, CommonAnimationData } from '@modules/reward-animations/reward-animations.service';

@Component({
    selector: 'pl-play-animation',
    templateUrl: 'play-animation.component.html',
    styleUrls: ['play-animation.component.less'],
})

export class PlayAnimationComponent implements OnInit {
    private isHoveringSubject = new BehaviorSubject<boolean>(false);

    @Input() animation: CommonAnimationData;

    isSelectable$: Observable<boolean>;
    selected$: Observable<boolean>;
    showPlayBtn$: Observable<boolean>;
    showPlayIcon$: Observable<boolean>;
    showLoaderIcon$: Observable<boolean>;

    set isHovering(val: boolean) {
        this.isHoveringSubject.next(val);
    }

    get iconPath() {
        return this.animation.iconPath;
    }

    constructor(
        private rewardAnimationsService: RewardAnimationsService,
    ) {}

    ngOnInit() {
        const isHovering$ = this.isHoveringSubject.asObservable();
        const somethingPlaying$ = this.rewardAnimationsService.queuedAnimation$.pipe(
            map(animaiton => !!animaiton),
        );
        const mePlaying$ = this.rewardAnimationsService.queuedAnimation$.pipe(
            map(animation => animation && animation.name === this.animation.name),
        );

        this.isSelectable$ = somethingPlaying$.pipe(
            map(val => !val),
        );

        this.selected$ = combineLatest([
            mePlaying$,
            isHovering$,
            somethingPlaying$,
        ]).pipe(
            map(([mePlaying, isHovering, somethingPlaying]) => mePlaying || (isHovering && !somethingPlaying)),
        );

        this.showPlayBtn$ = combineLatest([
            isHovering$,
            somethingPlaying$,
        ]).pipe(
            map(([isHovering, somethingPlaying]) => isHovering || somethingPlaying),
        );

        this.showPlayIcon$ = combineLatest([
            mePlaying$,
            somethingPlaying$,
        ]).pipe(
            map(([mePlaying, somethingPlaying]) => !mePlaying && !somethingPlaying),
        );

        this.showLoaderIcon$ = mePlaying$;
    }

    playAnimation(animation: CommonAnimationData) {
        this.rewardAnimationsService.queueAnimation(animation);
    }
}
