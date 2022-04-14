import { Observable } from 'rxjs';

export const teardown = (onComplete: () => void) => {
    return <T>(source$: Observable<T>) => new Observable<T>(((subscriber) => {
        const subscription = source$.subscribe(subscriber);
        subscriber.add(() => {
            onComplete();
            subscription.unsubscribe();
        });
    }));
};
