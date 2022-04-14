export class WindowChannel {
    constructor(
        private target: Window,
        private origin: string,
    ) {
    }

    on<Data>(event: string, cb: (data: Data) => void) {
        const listener = (ev: MessageEvent) => {
            if (!this.isAllowed(ev)) {
                return;
            }
            const { type, data } = ev.data;
            if (type !== event) {
                return;
            }
            cb(data);
        };
        window.addEventListener('message', listener, false);
        return () => {
            window.removeEventListener('message', listener, false);
        };
    }

    emit<Data>(event: string, data: Data) {
        this.target.postMessage({ data, type: event }, this.origin);
    }

    private isAllowed(ev: MessageEvent) {
        if (this.origin === '*') {
            return true;
        }
        if (this.origin !== ev.origin) {
            return false;
        }
        return true;
    }
}
