import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ConferenceStreamService } from './conference-stream.service';

@Component({
    selector: 'pl-conference-stream',
    templateUrl: 'conference-stream.component.html',
    providers: [
        ConferenceStreamService,
    ],
})

export class ConferenceStreamComponent implements OnInit {
    @Input() public streamId: string;

    public isLocal$: Observable<boolean>;

    constructor(
        private conferenceStreamService: ConferenceStreamService,
    ) {
        this.isLocal$ = this.conferenceStreamService.isLocal$;
    }

    ngOnInit() {
        this.conferenceStreamService.setId(this.streamId);
    }
}
