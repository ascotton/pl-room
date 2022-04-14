import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamSettingsService } from '../stream-settings.service';

@Component({
    selector: 'pl-remote-settings',
    templateUrl: 'remote-settings.component.html',
})

export class RemoteSettingsComponent implements OnInit {
    public streamIds$: Observable<string[]>;

    constructor(
        streamSettingsService: StreamSettingsService,
    ) {
        this.streamIds$ = streamSettingsService.streamIds$;
    }

    ngOnInit() { }
}
