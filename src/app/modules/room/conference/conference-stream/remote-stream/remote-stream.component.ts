import { Component } from '@angular/core';
import { RemoteStreamService } from './remote-stream.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'pl-remote-stream',
    templateUrl: 'remote-stream.component.html',
    providers: [
        RemoteStreamService,
    ],
})

export class RemoteStreamComponent {
    public canMute$: Observable<boolean>;
    public canDismiss$: Observable<boolean>;
    public canShowSettings$: Observable<boolean>;
    public canShowScreenshot$: Observable<boolean>;
    public participantId$: Observable<string>;

    constructor(
        private remoteStreamService: RemoteStreamService,
    ) {
        this.canMute$ = this.remoteStreamService.canMute$;
        this.canDismiss$ = this.remoteStreamService.canDismiss$;
        this.canShowSettings$ = this.remoteStreamService.canShowSettings$;
        this.participantId$ = this.remoteStreamService.participantId$;
        this.canShowScreenshot$ = this.remoteStreamService.canShowScreenshot$;
    }
}
