import { Injectable } from '@angular/core';
import { of, EMPTY } from 'rxjs';
import { exhaustMap, switchMap, catchError, map, concatMap, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '@app/store';
import { selectSessionReady, selectIsLocalParticipantHost } from '@room/session/store';
import { ScreenshareService } from '../screenshare.service';
import { ScreenshareActions } from './screenshare.actions';
import { selectIsScreenshareActive } from './screenshare.selectors';

@Injectable()
export class ScreenshareEffects {
    start$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ScreenshareActions.start),
            exhaustMap(() => {
                return this.screenshareService.start().pipe(
                    map(() => ScreenshareActions.startSuccess()),
                    catchError((error) => {
                        const errObj = {
                            error,
                        };
                        console.log('START_SCREENSHARE', errObj);
                        return of(ScreenshareActions.startError(errObj));
                    }),
                );
            }),
        );
    });

    stop$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ScreenshareActions.stop),
                tap(() => {
                    this.screenshareService.stop();
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    persistActive$ = createEffect(
        () => {
            return this.onHostSession().pipe(
                switchMap(() => {
                    return this.store.select(selectIsScreenshareActive).pipe(
                        concatMap((isActive) => {
                            return this.screenshareService.setIsActive(isActive).pipe(
                                catchError((error) => {
                                    console.log('SET_SCREENSHARE_ACTIVE', error);
                                    return EMPTY;
                                }),
                            );
                        }),
                    );
                }),
            );
        },
        {
            dispatch: false,
        },
    );

    hostUpdatedScreenshare$ = createEffect(
        () => {
            return this.onHostUpdatedScreenshare().pipe(
                map((isActive) =>  {
                    if (isActive) {
                        return ScreenshareActions.startedRemotely();
                    }

                    return ScreenshareActions.stoppedRemotely();
                }),
            );
        },
    );

    private onHostUpdatedScreenshare() {
        return this.onNonHostSession().pipe(
            switchMap(() => {
                return this.screenshareService.onIsActiveChanged();
            }),
        );
    }

    private onNonHostSession() {
        return this.selectIsHost().pipe(
            filter(isHost => !isHost),
        );
    }

    private onHostSession() {
        return this.selectIsHost().pipe(
            filter(isHost => isHost),
        );
    }

    private selectIsHost() {
        return this.store.pipe(
            selectSessionReady,
            switchMap(() => {
                return this.store.select(selectIsLocalParticipantHost);
            }),
        );
    }

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private screenshareService: ScreenshareService,
    ) { }
}
