import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { selectParticipantPrimaryStreamId } from '@room/conference/store';
import { StreamSettingsService } from '../../stream-settings.service';

@Injectable()
export class AudioSettingsService {
    public streamId: Observable<string>;

    constructor(
        streamSettingsService: StreamSettingsService,
        store: Store<AppState>,
    ) {
        this.streamId = streamSettingsService.participantId$.pipe(
            switchMap(id => store.select(selectParticipantPrimaryStreamId(id))),
        );
    }

    frequencyToPercent(data: Uint8Array) {
        const val = data[0] ? data[0] : 0;
        const maxValue = 256;
        const percentage = val * 100 / maxValue;
        return percentage;
    }
}
