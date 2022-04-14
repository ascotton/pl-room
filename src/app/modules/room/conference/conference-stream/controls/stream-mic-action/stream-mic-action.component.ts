import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamMicService } from './stream-mic.service';

@Component({
    selector: 'pl-stream-mic-action',
    templateUrl: 'stream-mic-action.component.html',
    providers: [
        StreamMicService,
    ],
})

export class StreamMicActionComponent implements OnInit {

    public isMuted$: Observable<boolean>;
    public disabled$: Observable<boolean>;

    constructor(
        private streamMicService: StreamMicService,
    ) {
        this.isMuted$ = this.streamMicService.isMuted$;
        this.disabled$ = this.streamMicService.preventMute$;
    }

    ngOnInit() { }

    mute() {
        this.streamMicService.mute();
    }

    unmute() {
        this.streamMicService.unmute();
    }
}
