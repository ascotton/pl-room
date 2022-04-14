import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamVideoService } from './stream-video.service';

@Component({
    selector: 'pl-stream-video-action',
    templateUrl: 'stream-video-action.component.html',
    providers: [
        StreamVideoService,
    ],
})

export class StreamVideoActionComponent implements OnInit {

    public isHidden$: Observable<boolean>;
    public disabled$: Observable<boolean>;

    constructor(
        private streamVideoService: StreamVideoService,
    ) {
        this.isHidden$ = this.streamVideoService.isHidden$;
        this.disabled$ = this.streamVideoService.preventHide$;
    }

    ngOnInit() { }

    show() {
        this.streamVideoService.show();
    }

    hide() {
        this.streamVideoService.hide();
    }
}
