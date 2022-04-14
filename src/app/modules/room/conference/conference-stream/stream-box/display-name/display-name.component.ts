import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamDisplayNameService } from './display-name.service';

@Component({
    selector: 'pl-stream-display-name',
    templateUrl: 'display-name.component.html',
    styleUrls: ['display-name.component.less'],
    providers: [
        StreamDisplayNameService,
    ],
})

export class StreamDisplayNameComponent implements OnInit {
    public displayName$: Observable<string>;
    public showMuted$: Observable<boolean>;
    public showCovered$: Observable<boolean>;
    public showClickMuted$: Observable<boolean>;

    constructor(
        streamDisplayNameService: StreamDisplayNameService,
    ) {
        this.displayName$ = streamDisplayNameService.displayName$;
        this.showMuted$ = streamDisplayNameService.isMuted$;
        this.showClickMuted$ = streamDisplayNameService.isGuestClickMuted$;
        this.showCovered$ = streamDisplayNameService.isCovered$;
    }

    ngOnInit() { }
}
