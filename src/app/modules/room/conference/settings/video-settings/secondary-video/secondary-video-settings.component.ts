import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SecondaryVideoSettingsService } from './secondary-video-settings.service';

@Component({
    selector: 'pl-secondary-video-settings',
    templateUrl: 'secondary-video-settings.component.html',
    styleUrls: ['secondary-video-settings.component.less'],
    providers: [
        SecondaryVideoSettingsService,
    ],
})

export class SecondaryVideoSettingsComponent implements OnInit {
    public streamId$: Observable<string | null>;
    public canUpdateVideoDevice$: Observable<boolean>;
    public canUpdateVideoLabel$: Observable<boolean>;
    public shouldRequestPermissions$: Observable<boolean>;
    public canCover$: Observable<boolean>;

    constructor(
        secondaryVideoSettings: SecondaryVideoSettingsService,
    ) {
        this.streamId$ = secondaryVideoSettings.streamId$;
        this.canUpdateVideoDevice$ = secondaryVideoSettings.isParticipantLocal$;
        this.canUpdateVideoLabel$ = secondaryVideoSettings.isHost$;
        this.shouldRequestPermissions$ = secondaryVideoSettings.shouldRequestPermissions$;
        this.canCover$ = secondaryVideoSettings.canCoverVideo$;
    }

    ngOnInit() { }
}
