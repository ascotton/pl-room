import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY, Subscription } from 'rxjs';
import { GiphyService, GiphySearchResult } from '@common/services/giphy.service';
import { map, distinctUntilChanged, tap, switchMap, catchError, debounceTime } from 'rxjs/operators';

export type GiphyAnimationsStatus = 'idle' | 'loading' | 'error' | 'success';

interface GiphyAnimationsState {
    status: GiphyAnimationsStatus;
    gifs: GiphySearchResult[];
    selected: GiphySearchResult | null;
    error?: any;
}

const initialState: GiphyAnimationsState = {
    status: 'idle',
    selected: null,
    gifs: [],
};

@Injectable()
export class GiphyAnimationsService {
    private subscriptions: Subscription[] = [];
    private stateSubject = new BehaviorSubject<GiphyAnimationsState>(initialState);
    private searchSubject = new BehaviorSubject<string>(null);

    gifs$: Observable<GiphySearchResult[]>;
    status$: Observable<GiphyAnimationsStatus>;
    selected$: Observable<GiphySearchResult>;
    hasGifs$: Observable<boolean>;

    error$: Observable<any>;

    hasPrev$: Observable<boolean>;
    hasNext$: Observable<boolean>;

    constructor(
        private giphyService: GiphyService,
    ) {
        const state$ = this.stateSubject.asObservable();
        this.gifs$ = state$.pipe(
            map(state => state.gifs),
            distinctUntilChanged(),
        );

        this.hasGifs$ = this.gifs$.pipe(
            map(gifs => !!gifs.length),
            distinctUntilChanged(),
        );

        this.status$ = state$.pipe(
            map(state => state.status),
            distinctUntilChanged(),
        );

        this.error$ = state$.pipe(
            map(state => state.error),
            distinctUntilChanged(),
        );

        this.selected$ = state$.pipe(
            map(state => state.selected),
            distinctUntilChanged(),
        );

        this.hasNext$ = this.selected$.pipe(
            map(selected => this.hasNext(selected)),
            distinctUntilChanged(),
        );

        this.hasPrev$ = this.selected$.pipe(
            map(selected => this.hasPrev(selected)),
            distinctUntilChanged(),
        );
    }

    onInit() {
        this.subscriptions.push(
            this.listenSearch(),
        );
    }

    onDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    setUrl(urlParam: string) {
        let url = urlParam.trim();
        if (!url.startsWith('http')) {
            const start = url.search(/[a-zA-Z0-9]/);
            url = 'https://' + url.substring(start);
        }
        this.setSuccess([{
            url,
            previewUrl: url,
            previewSmallUrl: url,
        }]);
    }

    search(termOrUrl: string) {
        if (this.isLikelyURL(termOrUrl)) {
            return this.setUrl(termOrUrl);
        }
        return this.searchSubject.next(termOrUrl);
    }

    clearSearch() {
        this.searchSubject.next(null);
    }

    next() {
        const state = this.getState();
        const { selected, gifs } = state;
        if (this.hasNext(selected)) {
            const index = gifs.findIndex(g => this.isEqual(g, selected));
            this.setSelected(gifs[index + 1]);
        }
    }

    prev() {
        const state = this.getState();
        const { selected, gifs } = state;
        if (this.hasPrev(selected)) {
            const index = gifs.findIndex(g => this.isEqual(g, selected));
            this.setSelected(gifs[index - 1]);
        }
    }

    private isLikelyURL(urlParam: string) {
        const url = urlParam.trim();
        // if the trimmed url still has whitespace, return false
        if (/\s/g.test(url)) {
            return false;
        }
        // otherwise return true if url contains at least one instance of letters or numbers separated by a '.'
        const urlTest = /[a-zA-Z0-9]\.[a-zA-Z0-9]/;
        return urlTest.test(url);
    }

    private setSelected(gif: GiphySearchResult) {
        const state = this.getState();
        const found = state.gifs.find(g => this.isEqual(g, gif));
        if (found) {
            this.setState({
                selected: found,
            });
        }
    }

    private hasPrev(gif: GiphySearchResult) {
        const state = this.getState();
        const index = state.gifs.findIndex(g => this.isEqual(g, gif));

        return index > 0;
    }

    private hasNext(gif: GiphySearchResult) {
        const state = this.getState();
        const index = state.gifs.findIndex(g => this.isEqual(g, gif));

        return index < state.gifs.length - 1;
    }

    private isEqual(a: GiphySearchResult, b: GiphySearchResult) {
        return a.url === b.url;
    }

    private listenSearch() {
        return this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => {
                this.setLoading();
            }),
            switchMap((term) => {
                if (!term) {
                    this.setSuccess([]);
                    return EMPTY;
                }
                return this.giphyService.search({ terms: term, rating: 'g' }).pipe(
                    tap((results) => {
                        this.setSuccess(results);
                    }),
                    catchError((error) => {
                        this.setError(error);
                        return EMPTY;
                    }),
                );
            }),
        ).subscribe();
    }

    private setLoading() {
        const state = this.stateSubject.getValue();
        this.setState({
            status: 'loading',
            gifs: state.gifs,
        });
    }

    private setSuccess(gifs: GiphySearchResult[]) {
        const first = gifs[0];
        this.setState({
            gifs,
            selected: first,
            status: 'success',
        });
    }

    private setError(error: any) {
        this.setState({
            error,
            gifs: [],
            selected: null,
            status: 'error',
        });
    }

    private getState() {
        return this.stateSubject.getValue();
    }

    private setState(newState: Partial<GiphyAnimationsState>) {
        const state = this.getState();
        this.stateSubject.next({
            ...state,
            ...newState,
        });
    }
}
