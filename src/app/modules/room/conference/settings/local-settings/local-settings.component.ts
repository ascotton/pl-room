import { Component, OnInit } from '@angular/core';
import { StreamSettingsService } from '../stream-settings.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'pl-local-settings',
    templateUrl: 'local-settings.component.html',
})

export class LocalSettingsComponent implements OnInit {
    public streamIds$: Observable<string[]>;

    constructor(
        streamSettingsService: StreamSettingsService,
    ) {
        this.streamIds$ = streamSettingsService.streamIds$;
    }

    ngOnInit() { }
}
