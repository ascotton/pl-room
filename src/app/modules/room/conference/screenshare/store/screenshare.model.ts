export enum ScreenshareStatus {
    idle = 'idle',
    loading = 'loading',
    sharing = 'sharing',
    error = 'error',
}

export interface ScreenshareState {
    status: ScreenshareStatus;
    error?: any;
}
