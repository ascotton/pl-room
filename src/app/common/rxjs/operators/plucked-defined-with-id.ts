import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export type PluckDefinedResult<T> = [string, T];

export const pluckDefinedWithId = <T, K extends keyof T>(key: K) => {
    return (source$: Observable<PluckDefinedResult<T>>): Observable<PluckDefinedResult<T[K]>> => {
        return source$.pipe(
            map(([id, data]) => {
                const result: PluckDefinedResult<T[K]> = [
                    id,
                    data[key],
                ];

                return result;
            }),
            filter(([_, val]) => typeof val !== 'undefined'),
        );
    };
};
