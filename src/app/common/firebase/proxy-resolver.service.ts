import { Injectable } from '@angular/core';

const FORCE_PROXY_KEY = 'firebase_force_proxy';
const FIREBASE_SDK_PREFIX = 'https://www.gstatic.com/firebasejs/8.9.0/';

const firebaseLibs = [
    'firebase-app.js',
    'firebase-auth.js',
    'firebase-database.js',
];

@Injectable({ providedIn: 'root' })
export class FirebaseResolverService {
    private scripts: string[];

    constructor() {
        this.scripts = firebaseLibs.map(lib => `${FIREBASE_SDK_PREFIX}${lib}`);

        if (!!localStorage.getItem(FORCE_PROXY_KEY)) {
            this.scripts = ['/assets/js/fauxket.js', ...this.scripts];
        }
    }

    load() {
        return this.scripts.reduce(
            (prevPromise, src) => {
                return prevPromise.then(() => this.loadScript(src));
            },
            Promise.resolve(''),
        );
    }

    private loadScript(src: string) {
        return new Promise<string>((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
            script.onload = () => {
                resolve(src);
            };
            document.head.insertBefore(script, document.head.firstChild);
        });
    }
}
