import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UrlPlayback } from '@common/media';
import { AudioSettingsService } from '../audio-settings.service';

const audioFile = '/assets/audio/oxygen.mp3';

@Injectable()
export class SpeakersTestService {
    public level$: Observable<number>;

    private playback = new UrlPlayback(audioFile, {
        frequencyDataLength: 1,
    });

    constructor(
        audioSettingsService: AudioSettingsService,
    ) {
        this.level$ = this.playback.frequencyData$.pipe(
            map(fdata => audioSettingsService.frequencyToPercent(fdata)),
            distinctUntilChanged(),
        );
    }

    test() {
        this.playback.play().subscribe();
    }
}
