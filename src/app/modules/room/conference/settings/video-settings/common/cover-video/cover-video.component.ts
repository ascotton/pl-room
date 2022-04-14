import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CoverVideoService } from './cover-video.service';

@Component({
    selector: 'pl-cover-video',
    templateUrl: 'cover-video.component.html',
    providers: [
        CoverVideoService,
    ],
})

export class CoverVideoComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public isCovered = false;

    constructor(
        private coverVideoService: CoverVideoService,
    ) {}

    ngOnInit() {
        this.subs.push(
            this.listenIsCovered(),
        );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    listenIsCovered() {
        return this.coverVideoService.isCovered$.pipe(
            take(1),
        ).subscribe((val) => {
            this.isCovered = val;
        });
    }

    cover() {
        this.coverVideoService.cover();
    }

    uncover() {
        this.coverVideoService.uncover();
    }
}
