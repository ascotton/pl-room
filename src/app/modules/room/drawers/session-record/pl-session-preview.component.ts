import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConferenceService } from '@room/conference';
import { RECORD_STREAM_ID } from '../videos/tokbox-record.service';

@Component({
    selector: 'pl-session-preview',
    templateUrl: 'pl-session-preview.component.html',
    styleUrls: ['pl-session-preview.component.less'],
})

export class PLSessionPreviewComponent implements OnInit {
    public mediaStream$: Observable<MediaStream>;

    constructor(
        conferenceService: ConferenceService,
    ) {
        this.mediaStream$ = conferenceService.getMediaStream(RECORD_STREAM_ID);
    }

    ngOnInit() { }
}
