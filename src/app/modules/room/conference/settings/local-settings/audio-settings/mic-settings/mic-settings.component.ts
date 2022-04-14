import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MicSettingsService } from './mic-settings.service';

@Component({
    selector: 'pl-mic-settings',
    templateUrl: 'mic-settings.component.html',
    providers: [
        MicSettingsService,
    ],
})

export class MicSettingsComponent implements OnInit {
    public level$: Observable<number>;

    constructor(
        private micSettingsService: MicSettingsService,
    ) {
        this.level$ = this.micSettingsService.micLevel$;
    }

    ngOnInit() { }
}
