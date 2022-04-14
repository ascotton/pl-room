import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { RewardAnimationsService, AnimationData } from '@modules/reward-animations/reward-animations.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pl-animations-dialog',
    templateUrl: 'pl-animations-dialog.component.html',
    styleUrls: ['pl-animations-dialog.component.less'],
    encapsulation: ViewEncapsulation.None,
})

export class PLAnimationsDialogComponent implements OnInit, OnDestroy {
    sub: Subscription;
    soundOn = true;

    rewardAnimations: AnimationData[];
    alertAnimations: AnimationData[];

    constructor(
        private rewardAnimationsService: RewardAnimationsService,
    ) {
        this.rewardAnimations = [
            ...this.rewardAnimationsService.getAnimationData('reward'),
            ...this.rewardAnimationsService.getAnimationData('emojiReward'),
        ];

        this.alertAnimations = [
            ...this.rewardAnimationsService.getAnimationData('alert'),
            ...this.rewardAnimationsService.getAnimationData('emojiAlert'),
        ];
    }

    ngOnInit() {
        this.sub = this.rewardAnimationsService.soundOn$.subscribe((newVal) => {
            this.soundOn = newVal;
        });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    setSoundOn(newVal: boolean) {
        this.rewardAnimationsService.setSoundOn(newVal);
    }
}
