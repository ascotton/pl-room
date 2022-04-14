import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectShowSecondary } from '@room/conference/store';
import { StreamSettingsService } from '../stream-settings.service';

@Injectable()
export class VideoSettingsService {
    public canShowSecondary$: Observable<boolean>;
    constructor(
        store: Store<AppState>,
        streamSettingsService: StreamSettingsService,
    ) {
        this.canShowSecondary$ = streamSettingsService.participantId$.pipe(
            switchMap(id => store.select(selectShowSecondary(id))),
        );
    }
}
