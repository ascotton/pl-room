import { map, concatMap, shareReplay } from 'rxjs/operators';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Playback, PlaybackOptions } from './playback';

export enum PlaybackStatus {
    stopped = 'stopped',
    playing = 'playing',
}

export class UrlPlayback extends Playback {
    private sourceNode: AudioBufferSourceNode;

    private readonly audioBuffer$: Observable<AudioBuffer>;
    private readonly status$ = new BehaviorSubject(PlaybackStatus.stopped);

    constructor(private src: string, options?: PlaybackOptions) {
        super(options);

        this.audioBuffer$ = this.getAudioBuffer().pipe(
            shareReplay({ refCount: true, bufferSize: 1 }),
        );
    }

    play() {
        return this.audioBuffer$.pipe(
            map(audioBuffer => this.playBuffer(audioBuffer)),
        );
    }

    private playBuffer(buffer: AudioBuffer) {
        this.setupNodes();
        this.sourceNode.buffer = buffer;
        this.sourceNode.start(0);
        this.sourceNode.onended = () => {
            this.status$.next(PlaybackStatus.stopped);
        };
        this.status$.next(PlaybackStatus.playing);
    }

    private setupNodes() {
        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.connect(this.audioContext.destination);
        this.connectAnayser(this.sourceNode);
    }

    private getAudioBuffer() {
        return this.fetchBuffer(this.src).pipe(
            concatMap(response => this.decodeAudioData(response)),
        );
    }

    private decodeAudioData(buffer: ArrayBuffer) {
        return from(this.audioContext.decodeAudioData(buffer));
    }

    private fetchBuffer(src: string): Observable<ArrayBuffer> {
        return ajax({
            url: src,
            method: 'GET',
            responseType: 'arraybuffer',
        }).pipe(
            map(({ response }) => response),
        );
    }
}
