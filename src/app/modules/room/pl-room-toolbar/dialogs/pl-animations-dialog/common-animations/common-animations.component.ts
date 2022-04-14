import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AnimationData } from '@modules/reward-animations/reward-animations.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'pl-common-animations',
    templateUrl: 'common-animations.component.html',
    styleUrls: ['common-animations.component.less'],
    encapsulation: ViewEncapsulation.None,
})

export class CommonAnimationsComponent implements OnInit {
    @Input() animations: AnimationData[];

    currentPage = 0;
    pageSize = 8;
    currentAnimations: AnimationData[];

    ngOnInit() {
        this.setCurrentAnimations();
    }

    onPage(ev: PageEvent) {
        this.currentPage = ev.pageIndex;
        this.setCurrentAnimations();
    }

    setCurrentAnimations() {
        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;
        this.currentAnimations = this.animations.slice(start, end);
    }
}
