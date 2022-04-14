import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { map, switchMap, take, concatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppActions } from './app.actions';
import { AppModelService } from '../app-model.service';
import { selectIsRoomReady } from '../../store/room.selector';
import { LayoutMode } from './app.model';

@Injectable()
export class AppEffects {

    remoteValuesChanged$ = createEffect(
        () => {
            return this.store.pipe(
                selectIsRoomReady,
                switchMap(() => this.appModelService.onChanged()),
                map(data => AppActions.updateFromRemote({
                    data,
                })),
            );
        },
    );

    setIsMouseShared$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AppActions.setCursorSharing),
                concatMap(({ isCursorShared, isToggleDisabled }) => {
                    return this.appModelService.update({ isCursorShared, isToggleDisabled }).pipe(
                        map(() => AppActions.setCursorSharingSuccess({ isCursorShared, isToggleDisabled })),
                        catchError((error) => {
                            const errorObj = {
                                error,
                            };
                            console.error('SET_MOUSE_SHARING', errorObj);
                            return of(AppActions.updateFailed(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    setClientMouseClick$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AppActions.setClientMouseClick),
                concatMap(({ isClientClickMuted }) => {
                    return this.appModelService.update({ isClientClickMuted }).pipe(
                        map(() => AppActions.setClientMouseClickSuccess({ isClientClickMuted })),
                        catchError((error) => {
                            const errorObj = {
                                error,
                            };
                            console.error('SET_CLIENT_CLICK', errorObj);
                            return of(AppActions.updateFailed(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    setLayoutMode$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AppActions.setLayoutMode),
                concatMap(({ layoutMode }) => {
                    const isFullscreen = layoutMode !== LayoutMode.compact;
                    const updateObj: any = {
                        layoutMode,
                    };

                    if (isFullscreen) {
                        updateObj.whiteboardActive = false;
                    }

                    return this.appModelService.update(updateObj).pipe(
                        map(() => AppActions.setLayoutModeSuccess({ layoutMode })),
                        catchError((error) => {
                            const errorObj = {
                                error,
                            };
                            console.error('SET_LAYOUT_MODE', errorObj);
                            return of(AppActions.updateFailed(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private appModelService: AppModelService,
    ) {}
}
