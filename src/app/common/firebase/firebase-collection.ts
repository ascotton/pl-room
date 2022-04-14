import { FirebaseRef, FirebaseLibRef } from './firebase-ref';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Entity {
    id: string;
}

export type Add<TEntity extends Entity> = Omit<TEntity, 'id'> & { id?: string; };
export type Update<TEntity extends Entity> = PartialDeep<Omit<TEntity, 'id'>>;

export class FirebaseCollection<TEntity extends Entity> {
    private listRef: FirebaseRef;

    constructor(ref: FirebaseLibRef) {
        this.listRef = new FirebaseRef(ref);
    }

    onAdded(): Observable<TEntity> {
        return this.listRef.childAdded.pipe(
            map(snap => ({ id: snap.key, ...snap.val() })),
        );
    }

    onChanged(): Observable<PartialDeep<TEntity> & { id: string }> {
        return this.listRef.childChanged.pipe(
            map(snap => ({ id: snap.key, ...snap.val() })),
        );
    }

    onRemoved(): Observable<string> {
        return this.listRef.childRemoved.pipe(map(snap => snap.key));
    }

    hasChild(id: string) {
        return this.getChildRef(id).on('value').pipe(
            map(snap => snap.exists()),
            distinctUntilChanged(),
        );
    }

    getAll(): Observable<TEntity[]> {
        return this.listRef.get().pipe(
            map((snapshot) => {
                if (!snapshot.exists()) {
                    return [];
                }
                const normalizedVal = snapshot.val();
                const ids = Object.keys(normalizedVal);
                return ids.map(id => ({ id, ...normalizedVal[id] }));
            }),
        );
    }

    add(data: Add<TEntity>) {
        const ref = this.getChildRef(data.id);
        return ref
            .set(data)
            .pipe(
                map(() => ({
                    ...data,
                    id: ref.ref.key,
                })),
            );
    }

    update(id: string, data: Update<TEntity>) {
        const ref = this.getChildRef(id);
        return ref
            .update(data)
            .pipe(
                map(() => data),
            );
    }

    remove(id: string) {
        const ref = this.getChildRef(id);
        return ref.remove();
    }

    bulkRemove(ids: string[]) {
        const updates: Record<string, null> = {};

        for (const id of ids) {
            updates[id] = null;
        }

        return this.listRef.update(updates);
    }

    getChildRef(id?: string) {
        if (!id) {
            return new FirebaseRef(this.listRef.ref.push());
        }
        return new FirebaseRef(this.listRef.ref.child(id));
    }
}
