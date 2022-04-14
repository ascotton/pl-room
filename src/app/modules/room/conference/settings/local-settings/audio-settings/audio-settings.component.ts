import { Component, OnInit } from '@angular/core';
import { AudioSettingsService } from './audio-settings.service';

@Component({
    selector: 'pl-audio-settings',
    templateUrl: 'audio-settings.component.html',
    providers: [
        AudioSettingsService,
    ],
})

export class AudioSettingsComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
