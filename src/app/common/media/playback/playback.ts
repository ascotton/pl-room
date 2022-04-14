import { map } from 'rxjs/operators';
import { Observable, interval } from 'rxjs';

export interface PlaybackOptions {
    frequencyDataInterval?: number;
    frequencyDataLength?: number;
}

export class Playback {
    protected audioContext = new AudioContext();
    private analyserNode: AnalyserNode;

    public readonly frequencyData$: Observable<Uint8Array>;

    constructor(private options: PlaybackOptions = {}) {
        this.analyserNode = this.audioContext.createAnalyser();
        this.frequencyData$ = this.onFrequencyData();
    }

    private onFrequencyData() {
        return interval(this.options.frequencyDataInterval || 20).pipe(
            map(() => this.getFrequencyData()),
        );
    }

    private getFrequencyData() {
        const array = this.createFrequencyArray();
        this.analyserNode.getByteFrequencyData(array);
        return array;
    }

    private createFrequencyArray() {
        const length = this.options.frequencyDataLength || this.analyserNode.frequencyBinCount;
        return new Uint8Array(length);
    }

    protected connectAnayser(sourceNode: AudioNode) {
        sourceNode.connect(this.analyserNode);
        return this.analyserNode;
    }
}
