import { Injectable } from '@angular/core';
import { from } from 'rxjs';

export interface FirebaseConfig {
    customToken: string;
    roomName: string;
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket: string;
    messagingSenderId: string;
}

export type LazyRef = () => firebase.database.Reference;

@Injectable({ providedIn: 'root' })
export class FirebaseService {
    private config: FirebaseConfig;

    constructor() {}

    initialize(config: FirebaseConfig) {
        if (this.config) {
            throw new Error('FirebaseService already initialized');
        }
        this.config = config;

        this.initializeApp();

        return this.signIn();
    }

    getRoomRef(path: string) {
        if (!this.config) {
            throw new Error('You should initialize FirebaseService first');
        }

        const { roomName } = this.config;

        return firebase.database().ref(`${roomName}/${path}`);
    }

    getLazyRoomRef(path: string): LazyRef {
        let ref: firebase.database.Reference;
        return () => {
            ref = ref || this.getRoomRef(path);
            return ref;
        };
    }

    private initializeApp() {
        const {
            apiKey,
            authDomain,
            databaseURL,
            storageBucket,
            messagingSenderId,

        } = this.config;

        firebase.initializeApp({
            apiKey,
            authDomain,
            databaseURL,
            storageBucket,
            messagingSenderId,
        });
    }

    private signIn() {
        const { customToken } = this.config;

        return from(firebase.auth().signInWithCustomToken(customToken));
    }
}
