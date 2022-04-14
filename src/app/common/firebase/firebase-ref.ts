import { Observable, from } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { FirebaseOnDisconnect } from './firebase-on-disconnect';

export type FirebaseRefEventType = firebase.database.EventType;
export interface FirebaseSnapshot<Value = any> extends Omit<firebase.database.DataSnapshot, 'val'> {
    val: () => Value;
}
export type RefQueryBuilder = (ref: firebase.database.Reference) => firebase.database.Query;
type LazyReference = () => firebase.database.Reference;
export type FirebaseLibRef = firebase.database.Reference | LazyReference;
export class FirebaseRef<Value = any> {

    static build<T>(key: string) {
        if (firebase.apps.length === 0) {
            return null;
        }
        return new FirebaseRef<T>(firebase.database().ref(key));
    }

    constructor(private reference: FirebaseLibRef) {
    }

    get ref() {
        if (typeof this.reference === 'function') {
            return this.reference();
        }
        return this.reference;
    }

    get valueChanges() {
        return this.on('value');
    }

    get childAdded() {
        return this.on('child_added');
    }

    get childRemoved() {
        return this.on('child_removed');
    }

    get childChanged() {
        return this.on('child_changed').pipe(
            filter(snapshot => !!snapshot.val()),
        );
    }

    get childMoved() {
        return this.on('child_moved');
    }

    push(value: Value | null) {
        return from(this.ref.push(value));
    }

    get(queryBuilder: RefQueryBuilder = ref => ref) {
        const listRef = queryBuilder(this.ref);
        return from(listRef.get());
    }

    set(value: Value | null) {
        return from(this.ref.set(value));
    }

    update(data: Partial<Value>): Observable<any>;
    update(values?: any) {
        return from(this.ref.update(values));
    }

    remove() {
        return from(this.ref.remove());
    }

    transaction(transactionUpdate) {
        return from(this.ref.transaction(transactionUpdate));
    }

    createOnDisconnect() {
        return new FirebaseOnDisconnect(this.ref.onDisconnect());
    }

    on(event: FirebaseRefEventType, queryBuilder: RefQueryBuilder = ref => ref) {
        return new Observable<FirebaseSnapshot<Value>>((subscriber) => {
            const ref = queryBuilder(this.ref);
            const cb = ref.on(
              event,
              (snapshot: FirebaseSnapshot<Value>) => {
                  subscriber.next(snapshot);
              },
              (err: any) => {
                  subscriber.error(err);
              },
            );
            subscriber.add(() => {
                ref.off(event, cb);
            });
        });
    }

    onSnapshotValue(event: FirebaseRefEventType, queryBuilder: RefQueryBuilder = ref => ref) {
        return this.on(event, queryBuilder).pipe(
            map(snapshot => snapshot.val()),
        );
    }
}
