import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PrimaryVideoSettingsService } from './primary-video-settings.service';

@Component({
    selector: 'pl-primary-video-settings',
    templateUrl: 'primary-video-settings.component.html',
    styleUrls: ['primary-video-settings.component.less'],
    providers: [
        PrimaryVideoSettingsService,
    ],
})

export class PrimaryVideoSettingsComponent implements OnInit {
    public streamId$: Observable<string>;
    public canUpdateVideoDevice$: Observable<boolean>;
    public canUpdateVideoLabel$: Observable<boolean>;
    public canCover$: Observable<boolean>;

    constructor(
        primaryVideoSettings: PrimaryVideoSettingsService,
    ) {
        this.streamId$ = primaryVideoSettings.streamId$;
        this.canUpdateVideoDevice$ = primaryVideoSettings.isLocal$;
        this.canUpdateVideoLabel$ = primaryVideoSettings.isHost$;
        this.canCover$ = primaryVideoSettings.canCoverVideo$;
    }

    ngOnInit() { }
}
