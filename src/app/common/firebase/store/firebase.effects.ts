import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, exhaustMap, concatMap, withLatestFrom, filter } from 'rxjs/operators';
import { FirebaseRef } from '../firebase-ref';
import { FirebaseActions } from './firebase.actions';
import { FirebaseService } from '../firebase.service';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import { selectIsFirebaseInitialized } from './firebase.selectors';

@Injectable()
export class FirebaseEffects {
    isConnected$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(FirebaseActions.setInitialized),
                switchMap(() => {
                    return new FirebaseRef(
                        firebase.database().ref('.info/connected'),
                    ).valueChanges.pipe(
                        map(snap => FirebaseActions.setIsConnected({
                            isConnected: Boolean(snap.val()),
                        })),
                    );
                }),
            );
        },
    );

    initialize$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(FirebaseActions.initialize),
                concatMap((action) => {
                    return of(action).pipe(
                        withLatestFrom(this.store.select(selectIsFirebaseInitialized)),
                    );
                }),
                filter(([_, isInitialized]) => !isInitialized),
                exhaustMap(([{ config }]) => {
                    return this.firebaseService.initialize(config);
                }),
                map(() => FirebaseActions.setInitialized()),
            );
        },
    );

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private firebaseService: FirebaseService,
    ) { }
}
