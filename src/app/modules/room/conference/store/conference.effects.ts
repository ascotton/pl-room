import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, exhaustMap, concatMap, withLatestFrom, catchError, tap, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Update } from '@common/firebase/firebase-collection';
import { RoomActions } from '@room/store';
import { ConferenceService } from '../conference.service';
import { ConferenceRTService } from '../conference-rt.service';
import { ConferenceActions } from './conference.actions';
import { selectConferenceStreamsInSession } from './conference.selectors';
import { AppActions, LayoutMode } from '../../app/store';
import { StreamLike, StreamType } from './conference.model';
import { selectSessionReady } from '../../session/store';

@Injectable()
export class ConferenceEffects {

    setConferenceConfig$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(RoomActions.setSuccess),
                tap(({ data }) => {
                    const {
                        tokbox_api_key,
                        tokbox_session_id,
                        tokbox_token,
                    } = data;

                    this.conferenceService.setConfig({
                        tokbox: {
                            apiKey: tokbox_api_key,
                            conferenceId: tokbox_session_id,
                            connectionToken: tokbox_token,
                        },
                    });
                }),
                switchMap(() => this.store.pipe(selectSessionReady)),
                map(() => ConferenceActions.init()),
            );
        },
    );

    initConferenceProvider$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ConferenceActions.init),
            exhaustMap(() => {
                return this.conferenceService.init().pipe(
                    map(() => ConferenceActions.initSuccess()),
                    catchError((error) => {
                        const errorObj = {
                            error,
                        };
                        console.error('CONFERENCE_INIT', errorObj);
                        return of(ConferenceActions.initError(errorObj));
                    }),
                );
            }),
        );
    });

    setConferenceStatus$ = createEffect(
        () => {
            return this.conferenceService.getStatus().pipe(
                map(status => ConferenceActions.setConferenceStatus({ status })),
            );
        },
    );

    layoutModeChange$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AppActions.setLayoutMode),
                concatMap(({ layoutMode }) => {
                    return of(layoutMode).pipe(
                        withLatestFrom(this.store.select(selectConferenceStreamsInSession)),
                    );
                }),
                concatMap(([layoutMode, streams]) => {
                    const data: Record<string, Update<StreamLike>> = {};
                    streams.forEach((stream) => {
                        let isPromoted = false;
                        if (layoutMode === LayoutMode.grid) {
                            isPromoted = true;
                        } else if (layoutMode === LayoutMode.jumbotron
                            && stream.isLocal
                            && stream.type === StreamType.primary) {
                            isPromoted = true;
                        }
                        data[stream.id] = {
                            isPromoted,
                        };
                    });
                    return this.conferenceRTService.updateMultipleStreams(data).pipe(
                        map(() => ConferenceActions.setLayoutModeSuccess({ layoutMode })),
                        catchError((error) => {
                            const errorObj = {
                                layoutMode,
                                error,
                            };
                            console.error('SET_LAYOUT_MODE', errorObj);
                            return of(ConferenceActions.setLayoutModeError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    constructor(
        private actions$: Actions,
        private conferenceService: ConferenceService,
        private conferenceRTService: ConferenceRTService,
        private store: Store<AppState>,
    ) { }
}
