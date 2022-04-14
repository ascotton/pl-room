import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamType } from '../../store';
import { LocalStreamService } from './local-stream.service';

@Component({
    selector: 'pl-local-stream',
    templateUrl: 'local-stream.component.html',
    providers: [
        LocalStreamService,
    ],
})

export class LocalStreamComponent implements OnInit, OnDestroy {
    public canMute$: Observable<boolean>;
    public participantId$: Observable<string>;

    get streamType() {
        return StreamType;
    }

    constructor(
        private localStreamService: LocalStreamService,
    ) {
        this.canMute$ = this.localStreamService.canMute$;
        this.participantId$ = this.localStreamService.participantId$;
    }

    ngOnInit() {
        this.localStreamService.join();
    }

    ngOnDestroy() {
        this.localStreamService.leave();
    }
}
