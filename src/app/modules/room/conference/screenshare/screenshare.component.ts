import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { ScreenshareService } from './screenshare.service';
import { selectIsScreenshareActive } from './store';

@Component({
    selector: 'pl-screenshare',
    templateUrl: 'screenshare.component.html',
    styleUrls: ['screenshare.component.less'],
})

export class ScreenshareComponent implements OnInit {
    public mediaStream$: Observable<MediaStream>;
    public isActive$: Observable<boolean>;

    constructor(
        store: Store<AppState>,
        screenshareService: ScreenshareService,
    ) {
        this.mediaStream$ = screenshareService.getMediaStream();
        this.isActive$ = store.select(selectIsScreenshareActive);
    }

    ngOnInit() { }
}
