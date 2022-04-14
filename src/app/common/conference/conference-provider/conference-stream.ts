export interface ConferenceStream {
    id: string;
    mediaStream: MediaStream;
    type: ConferenceStreamType;
    providerId?: string;
}

export enum ConferenceStreamType {
    camera = 'camera',
    screen = 'screen',
    custom = 'custom',
}
