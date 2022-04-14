import { Playback, PlaybackOptions } from './playback';

export class MediaStreamPlayback extends Playback {
    private sourceNode: MediaStreamAudioSourceNode;

    constructor(private mediaStream: MediaStream, options?: PlaybackOptions) {
        super(options);
        this.setupNodes();
    }

    private setupNodes() {
        this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.connectAnayser(this.sourceNode);
    }
}
