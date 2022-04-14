import { from } from 'rxjs';

export type FirebaseLibOnDisconnect = firebase.database.OnDisconnect;

export class FirebaseOnDisconnect {
    constructor(private reference: FirebaseLibOnDisconnect) {
    }

    cancel() {
        return from(this.reference.cancel());
    }

    remove() {
        return from(this.reference.remove());
    }

    set(value: any) {
        return from(this.reference.set(value));
    }

    update(values: any) {
        return from(this.reference.update(values));
    }
}
