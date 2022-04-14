import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StreamSettingsService } from './stream-settings.service';

export interface StreamSettingsData {
    participantId: string;
}

@Component({
    selector: 'pl-stream-settings',
    templateUrl: 'stream-settings.component.html',
    styleUrls: ['stream-settings.component.less'],
    providers: [
        StreamSettingsService,
    ],
})

export class StreamSettingsComponent implements OnInit {
    public isLocal$: Observable<boolean>;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: StreamSettingsData,
        private streamSettingsService: StreamSettingsService,
    ) {
        this.isLocal$ = this.streamSettingsService.isLocal$;
    }

    ngOnInit() {
        this.streamSettingsService.setId(this.data.participantId);
        // This is here because firefox doesn't give us the labels of devices even when
        // the user granted permissions for video box
        this.streamSettingsService.refreshDevices();
    }
}
