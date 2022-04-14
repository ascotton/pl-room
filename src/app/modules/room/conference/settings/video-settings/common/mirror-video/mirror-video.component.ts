import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MirrorVideoService } from './mirror-video.service';

@Component({
    selector: 'pl-mirror-video',
    templateUrl: 'mirror-video.component.html',
    providers: [
        MirrorVideoService,
    ],
})

export class MirrorVideoComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public isMirrored = false;

    constructor(
        private mirrorVideoService: MirrorVideoService,
    ) {}

    ngOnInit() {
        this.subs.push(
            this.listenIsMirrored(),
        );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    listenIsMirrored() {
        return this.mirrorVideoService.isMirrored$.pipe(
            take(1),
        ).subscribe((val) => {
            this.isMirrored = val;
        });
    }

    mirror() {
        this.mirrorVideoService.mirror();
    }

    unmirror() {
        this.mirrorVideoService.unmirror();
    }
}
