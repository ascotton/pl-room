import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom, filter, switchMap, concatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AppState } from '@app/store';
import { selectIsLocalParticipantHost, SessionActions, selectSessionReady, selectLocalParticipantId } from '@room/session/store';
import { SessionService } from '@room/session/session.service';
import { ConferenceRTService } from '../conference-rt.service';
import { ConferenceActions } from './conference.actions';
import { selectParticipantStreams } from './conference.selectors';
import { StreamType } from './conference.model';

@Injectable()
export class ConferenceCleanupEffects {

    removeExistingSecondaryStreams$ = createEffect(
        () => {
            return this.store.pipe(
                selectSessionReady,
                concatMap(() => {
                    return this.store.select(selectLocalParticipantId);
                }),
                switchMap((participantId) => {
                    const streamId = `${participantId}-${StreamType.secondary}`;
                    return this.conferenceRTService.removeStream(streamId).pipe(
                        map(() => ConferenceActions.removeLocalSecondarySuccess({ id: streamId })),
                        catchError((error) => {
                            const errorObj = {
                                error,
                                id: streamId,
                            };
                            console.error('REMOVE_EXISTING_SECONDARY', errorObj);
                            return of(ConferenceActions.removeLocalSecondaryError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    participantRemoved$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.addLocalSuccess),
                switchMap(() => {
                    return this.onParticipantRemoved().pipe(
                        map(participantId => ConferenceActions.removeParticipantStreams({ participantId })),
                    );
                }),
            );
        },
    );

    removeParticipantStreams$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(ConferenceActions.removeParticipantStreams),
                concatMap(({ participantId }) => {
                    return of(participantId).pipe(
                        withLatestFrom(this.store.select(selectParticipantStreams(participantId))),
                    );
                }),
                mergeMap(([participantId, streams]) => {
                    const ids = streams.map(stream => stream.id);
                    return this.conferenceRTService.removeMultipleStreams(ids).pipe(
                        map(() => ConferenceActions.removeParticipantStreamsSuccess({ participantId })),
                        catchError((error) => {
                            const errorObj = {
                                error,
                                participantId,
                            };
                            console.error('REMOVE_PARTICIPANT_STREAMS', errorObj);
                            return of(ConferenceActions.removeParticipantStreamsError(errorObj));
                        }),
                    );
                }),
            );
        },
    );

    removeStreamOutOfSession$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(SessionActions.addLocalSuccess),
                switchMap(() => {
                    return this.onStreamOutOfSession().pipe(
                        mergeMap((stream) => {
                            const { id } = stream;
                            return this.conferenceRTService.removeStream(id).pipe(
                                map(() => ConferenceActions.removeOutOfSessionStreamSuccess({ id })),
                                catchError((error) => {
                                    const errorObj = {
                                        id,
                                        error,
                                    };
                                    console.error('CLEANING STREAM', stream, errorObj);
                                    return of(ConferenceActions.removeOutOfSessionStreamError(errorObj));
                                }),
                            );
                        }),
                    );
                }),
            );
        },
    );

    private onStreamOutOfSession() {
        return this.actions$.pipe(
            ofType(
                ConferenceActions.addRemote,
                ConferenceActions.updateRemote,
            ),
            concatMap((action) => {
                const stream = {
                    id: (action as any).id,
                    ...action.stream,
                };
                return of(stream).pipe(
                    withLatestFrom(
                        this.store.select(selectIsLocalParticipantHost),
                        this.sessionService.hasParticipant(stream.participantId),
                    ),
                );
            }),
            filter(([_, isHost, participantExists]) => isHost && !participantExists),
            map(([stream]) => stream),
        );
    }

    private onParticipantRemoved() {
        return this.actions$.pipe(
            ofType(
                SessionActions.kickSuccess,
                SessionActions.removedRemotely,
            ),
            concatMap(({ id }) => {
                return of(id).pipe(
                    withLatestFrom(this.store.select(selectIsLocalParticipantHost)),
                );
            }),
            filter(([_, isHost]) => isHost),
            map(([id]) => id),
        );
    }

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private conferenceRTService: ConferenceRTService,
        private sessionService: SessionService,
    ) { }

}
